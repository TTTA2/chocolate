<script lang="ts">

    import * as monaco from 'monaco-editor';
    import { onDestroy, onMount } from 'svelte';

    export let onChangeValue: ((value: string) => void) | undefined = undefined;
    export let currentModel: monaco.editor.ITextModel | undefined = undefined;

    export let hasFocus = false;

    export let onBlur: (() => void) | undefined = undefined;

    //@ts-ignore
    const settings = global_settings;

	let editorElement: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

    $: if (hasFocus) {
        console.log(hasFocus);
        editor?.focus();
    }

    $: {
        if (currentModel) editor?.setModel(currentModel);
    }

    onDestroy(async () => editor.dispose());
    
    onMount(async () => {   

        const keywords = ["test", "aaaaa", "支払い"];

        monaco.languages.register({
            id: "hl",
        });

        monaco.languages.registerCompletionItemProvider('hl', {
            triggerCharacters: ["/"],            
            provideCompletionItems: (model, position, context) => {

                const wordUntil = model.getWordUntilPosition(position);
                const range = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
                const replaceRange = new monaco.Range(position.lineNumber, wordUntil.startColumn - 1, position.lineNumber, wordUntil.endColumn);

                const firstChar = model.getValueInRange(replaceRange);
                const isTriggerChar = firstChar ==  "/";
                
                const a: monaco.IMarkdownString = { value: "# test"};

                const snippet: monaco.languages.CompletionItem[] = settings.snippets.map((sn: any) => ({
                    label: sn.keyword,
                    insertText: isTriggerChar ? "" : sn.text,
                    detail: sn.detail,
                    range,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.None,
                    document: a,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    additionalTextEdits: isTriggerChar ? [
                        {
                            range: replaceRange,
                            text: sn.text
                        }
                    ]: undefined
                }))

                const s = [...snippet];

                // const s: monaco.languages.CompletionItem[] = keywords.map(keyword => ({
                //     label: keyword,
                //     insertText: "",
                //     range,
                //     kind: monaco.languages.CompletionItemKind.Snippet,
                //     detail: "こんにちは\nテストですわ",
                //     documentation: "aaaaa",
                //     additionalTextEdits: [
                //         {
                //             range: replaceRange,
                //             text: "こんにちは\nテストです\nあああああ\n",
                //         }
                //     ],
                // }));

                return { incomplete: false, suggestions: s}
            }
        });


        editor = monaco.editor.create(editorElement, {
            language: "hl",
            automaticLayout: true,
            scrollBeyondLastLine: true,
        });

        editor.onDidChangeModelContent((event) => {
            onChangeValue?.call(undefined, editor.getValue());
        });

        editor.onDidBlurEditorText((e) => {
            onBlur?.call(undefined);
        });
    });

</script>

<div class="mainContainer">
    <div class="edtiorContainer" bind:this={editorElement} />
</div>

<style>
    
    .mainContainer {
        width: 100%;
        height: 100%;
        overflow: hidden;

    }

    .edtiorContainer {
        width: 100%;
        height: 100%;
        /* overflow: hidden; */
    }

</style>


