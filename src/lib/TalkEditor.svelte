<script lang="ts">

    import MonacoEditor from "./wrapper/monacoEditor/MonacoEditor.svelte";
    import type { LogItem, Talk, TextModel } from "../log";
    import TalkLog from "./talkLogView/TalkLog.svelte";

    export let onChangeTalkItem: (((talkItem: Talk) => void) | undefined) = undefined;
    export let onCreateTalkItem: (((talkItem: Talk) => void) | undefined) = undefined;

    export let targetLogItem: LogItem | undefined;
    export let textModelMap: Map<string, TextModel> = new Map<string, TextModel>();

    let currentTargetLogItem: LogItem | undefined;

    let selectedTalkItem: Talk | undefined;
    // let currentModel: TextModel | undefined;
    let currentElement: HTMLDivElement | undefined;

    $: currentModel = selectedTalkItem ? textModelMap.get(selectedTalkItem.id)?.model : undefined;

    $: if (currentTargetLogItem?.id != targetLogItem?.id) {
        selectedTalkItem = targetLogItem?.talkItems[0];
        currentTargetLogItem = targetLogItem;
    }

    const getLastTalk = () => {

        if (!targetLogItem) return undefined;
        return targetLogItem.talkItems[targetLogItem.talkItems.length - 1];
    }

    const handleChangeSelectedTalk = (talk: Talk, element: HTMLDivElement) => {
        currentElement = element;
        selectedTalkItem = talk;
        // currentModel = selectedTalkItem ? textModelMap.get(selectedTalkItem.id) : undefined;
    }

    const handleChangeTextChange = (value: string) => {

        // const model = textModelMap.get(selectedTalkItem.id);            
        if (!selectedTalkItem) return;
        
        selectedTalkItem.body = value;
        currentElement?.scrollIntoView();

        const last = getLastTalk();
        if (last && selectedTalkItem.id == last?.id) {

            const newTalkItem: Talk = { id: crypto.randomUUID(), body: "", head: "CU" };
            targetLogItem?.talkItems.push(newTalkItem);

            onCreateTalkItem?.call(undefined, newTalkItem);
        }

        onChangeTalkItem?.call(undefined, selectedTalkItem);
    }

</script>

<div class="editorContainer">

    <TalkLog onSelectedChangeTalk={handleChangeSelectedTalk} {...{selectedTalkItem, targetLogItem}}/>

    <div class="textEditor {currentModel == undefined ? 'hidden' : ''}">
        <MonacoEditor onChangeValue={handleChangeTextChange} currentModel={currentModel}></MonacoEditor>
    </div>

</div>

<style>
    
    .editorContainer {
        display: grid;
        grid-template-columns: 0.5fr minmax(0, 0.5fr);
        width: 100%;
        height: 100%;       
        overflow: hidden;
    }

    .textEditor {
        width: 100%;
        height: 100%;

    }

</style>