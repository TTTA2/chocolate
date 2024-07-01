<script lang="ts">

    import MonacoEditor from "./wrapper/monacoEditor/MonacoEditor.svelte";
    import { getLastTalk, type LogItem, type Talk, type TextModel } from "../log";
    import TalkLog from "./talkLogView/TalkLog.svelte";
    import { editor } from "monaco-editor";
    import { Button } from "./components/ui/button";
    import { Input } from "./components/ui/input";

    export let onChangeTalkItem: (((talkItem: Talk) => void) | undefined) = undefined;
    export let onCreateTalkItem: (((talkItem: Talk) => void) | undefined) = undefined;
    export let onChangeLogItem: (((targetLog: LogItem) => void) | undefined) = undefined;

    export let targetLogItem: LogItem;
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

    const handleChangeSelectedTalk = (talk: Talk, newValue: boolean, element: HTMLDivElement) => {

        if (newValue) {
            currentElement = element;
            selectedTalkItem = talk;
            hasTextEditorFocus = true;

            currentElement?.scrollIntoView({behavior: "smooth" });
        }

        // currentModel = selectedTalkItem ? textModelMap.get(selectedTalkItem.id) : undefined;
    }

    const handleChangeTextChange = (value: string) => {

        // const model = textModelMap.get(selectedTalkItem.id);
        if (!selectedTalkItem) return;
        
        selectedTalkItem.body = value;
        currentElement?.scrollIntoView();

        const last = targetLogItem ? getLastTalk(targetLogItem) : undefined;

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

    const handleReverseTurn = () => {

        if (!targetLogItem) return;

        const t1 = settings.turn1, t2 = settings.turn2;
        const newItems = targetLogItem.talkItems.map(talk => ({...talk, head: talk.head == t1 ? t2 : t1})) 
        targetLogItem.talkItems = newItems;

        onChangeLogItem?.call(undefined, targetLogItem);
    }

    const handleChangeTimeValue = () => {
        onChangeLogItem?.call(undefined, targetLogItem);
    }

    const a = {
        aa: "",
        bb: "",
    }

</script>

<div class="toolbarContainer" >
    <div class="px-3 py-1 flex gap-4">
        <Input on:change={handleChangeTimeValue} bind:value={targetLogItem.openTimeText} class="w-36" placeholder="入電時間(時:分)" />
        <Input on:change={handleChangeTimeValue} bind:value={targetLogItem.acdTimeText} class="w-48" placeholder="通話時間(時:分:秒)" />
        <Button size="default" variant="outline" on:click={handleReverseTurn}>ターン反転</Button>
    </div>
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
</div>

<style>

    .toolbarContainer {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        width: 100%;
        height: 100%; 
        overflow: hidden;
    }
    
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