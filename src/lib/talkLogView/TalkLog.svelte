<script lang="ts">
    import type { Talk } from "src/log";
    import TalkLogCard from "./TalkLogCard.svelte";

    export let targetLogItem;
    export let selectedTalkItem: Talk | undefined = undefined;
    export let onSelectedChangeTalk: (talk: Talk, element: HTMLDivElement) => void;

    const handleSelectedTalk = (talk: Talk, element: HTMLDivElement) => {
        onSelectedChangeTalk?.call(undefined, talk, element);
    }

</script>

<div class="body flex flex-col p-4 gap-4">
    {#each targetLogItem?.talkItems ?? [] as talk, index }
        <TalkLogCard selected={selectedTalkItem?.id == talk.id} 
        onSelectedTalk={handleSelectedTalk}
        target={talk}></TalkLogCard>
    {/each}
</div>

<style>
    
    .body {
        overflow: auto;
        height: 100%;
        /* padding: 6px; */
    }

</style>