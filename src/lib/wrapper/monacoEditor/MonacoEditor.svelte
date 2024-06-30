<script lang="ts">

    import * as monaco from 'monaco-editor';
    import { onMount } from 'svelte';

    // export let value = "";
    
    export let onChangeValue: ((value: string) => void) | undefined = undefined;
    export let currentModel: monaco.editor.ITextModel | undefined = undefined;

    // const onChangeContent = (event) => {


    // }

	let editorElement: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

    $: {
        if (currentModel) editor?.setModel(currentModel);
    }
    
    onMount(async () => {   

        const keywords = ["test", "aaaaa"];

        monaco.languages.register({
            id: "hl",
        });

        monaco.languages.registerCompletionItemProvider('hl', {
            triggerCharacters: ["/"],            
            provideCompletionItems: (model, position, context) => {

                const wordUntil = model.getWordUntilPosition(position);
                const range = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
                const replaceRange = new monaco.Range(position.lineNumber, wordUntil.startColumn - 1, position.lineNumber, wordUntil.endColumn);

                const s: monaco.languages.CompletionItem[] = keywords.map(keyword => ({
                    label: keyword,
                    insertText: "",
                    range,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    detail: "こんにちは\nテストですわ",
                    documentation: "aaaaa",
                    additionalTextEdits: [
                        {
                            range: replaceRange,
                            text: "こんにちは\nテストです\nあああああ\n",
                        }
                    ],
                }));

                return { incomplete: false, suggestions: s}
            }
        });


        editor = monaco.editor.create(editorElement, {
            language: "hl",
            automaticLayout: true,
            scrollBeyondLastLine: true,
        });

        editor.onDidChangeModelContent((event) => {
            // console.log(event);
            onChangeValue?.call(undefined, editor.getValue());
        });

        // editor.getModel()?.onDidChangeContent((event) => {
        //     console.log("test");
        //     onChangeValue?.call(undefined, editor.getValue());
        // })
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


