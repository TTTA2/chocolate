<script lang="ts">

    import MonacoEditor from "./wrapper/monacoEditor/MonacoEditor.svelte";
    import type { LogItem, Talk, TextModel } from "../log";
    import TalkLog from "./talkLogView/TalkLog.svelte";
    import { editor } from "monaco-editor";

    export let onChangeTalkItem: (((talkItem: Talk) => void) | undefined) = undefined;
    export let onCreateTalkItem: (((talkItem: Talk) => void) | undefined) = undefined;

    export let targetLogItem: LogItem | undefined;
    export let textModelMap: Map<string, TextModel> = new Map<string, TextModel>();

    let currentTargetLogItem: LogItem | undefined;

    let selectedTalkItem: Talk | undefined;
    let currentElement: HTMLDivElement | undefined;

    let hasTextEditorFocus = false;

    $: currentModel = selectedTalkItem ? textModelMap.get(selectedTalkItem.id)?.model : undefined;

    $: if (currentTargetLogItem?.id != targetLogItem?.id) {
        selectedTalkItem = targetLogItem?.talkItems[0];
        currentTargetLogItem = targetLogItem;
    }

    $: if (targetLogItem?.talkItems.find(item => selectedTalkItem?.id == item.id) == undefined) {
        selectedTalkItem = targetLogItem?.talkItems[0];
    }

    // $: if (selectedTalkItem)
    
    //設定
    //@ts-ignore　エラー回避
	const settings = global_settings;
    
    const getLastTalk = () => {

        if (!targetLogItem) return undefined;
        return targetLogItem.talkItems[targetLogItem.talkItems.length - 1];
    }

    const handleChangeSelectedTalk = (talk: Talk, element: HTMLDivElement) => {
        currentElement = element;
        selectedTalkItem = talk;

        hasTextEditorFocus = true;
        // currentModel = selectedTalkItem ? textModelMap.get(selectedTalkItem.id) : undefined;
    }

    const handleChangeTextChange = (value: string) => {

        // const model = textModelMap.get(selectedTalkItem.id);
        if (!selectedTalkItem) return;
        
        selectedTalkItem.body = value;
        currentElement?.scrollIntoView();

        const last = getLastTalk();

        if (last && selectedTalkItem.id == last?.id) {

            const head = last.head == settings.turn1 ? settings.turn2 : settings.turn1;

            const newTalkItem: Talk = { id: crypto.randomUUID(), body: "", head };
            targetLogItem?.talkItems.push(newTalkItem);

            onCreateTalkItem?.call(undefined, newTalkItem);
        }

        onChangeTalkItem?.call(undefined, selectedTalkItem);
    }

    const handleBlur = () => {
        hasTextEditorFocus = false;
    }

    const handleKeyDown = (e: any) => {

        if (e.code == "Tab") {
            e.preventDefault();
            e.stopPropagation();

            if (!targetLogItem || !selectedTalkItem) return;

            const currentTalkIndex = targetLogItem?.talkItems.findIndex(item => item.id == selectedTalkItem?.id);

            // console.log(targetLogItem?.talkItems, selectedTalkItem?.id, currentTalkIndex);

            if (currentTalkIndex > -1) {

                console.log(currentTalkIndex);

                if (!e.shiftKey && currentTalkIndex < targetLogItem.talkItems.length - 1) {
                    selectedTalkItem = targetLogItem.talkItems[currentTalkIndex + 1];   
                }
                else if (e.shiftKey && currentTalkIndex > 0) {
                    selectedTalkItem = targetLogItem.talkItems[currentTalkIndex - 1];   
                }

            }

            // !e.shiftKey && 


        }
    }

</script>

<div class="editorContainer">

    <TalkLog onSelectedChangeTalk={handleChangeSelectedTalk} {...{selectedTalkItem, targetLogItem}}/>

    <div class="textEditor {currentModel == undefined ? 'hidden' : ''}">
        <MonacoEditor 
            onBlur={handleBlur} 
            onChangeValue={handleChangeTextChange} 
            currentModel={currentModel}
            hasFocus={hasTextEditorFocus} 
            onKeyDown={handleKeyDown}></MonacoEditor>
    </div>

</div>

<style>
    
    .editorContainer {
        display: grid;
        /* grid-template-rows: 0.5fr minmax(0, 0.5fr);         */
        grid-template-columns: 0.5fr minmax(0, 0.5fr);
        width: 100%;
        height: 100%;       
        overflow: hidden;
    }

    .textEditor {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

</style>