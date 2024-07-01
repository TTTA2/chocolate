<script lang="ts">
    import type { Talk } from "src/log";

    export let target: Talk;
    export let selected: boolean = false;
    export let onSelectedChangeTalk: (talk: Talk, newSelectedState: boolean, element: HTMLDivElement) => void;

    let element: HTMLDivElement;
    let b = undefined;
    let preSelectedState = false;

    $: selectedClass = selected ? "bg-blue-200" : "";

    $: if (preSelectedState != selected) {
        onSelectedChangeTalk?.call(undefined, target, selected, element,);
        preSelectedState = selected;
    }

    const handleClickCard = (e: any) => {
        b = e.target;
        selected = true;
        // onClickTalk?.call(undefined, target, element);
    }


</script>

<div class="card flex border rounded-md hover:bg-blue-100 {selectedClass}" bind:this={element} on:click={handleClickCard}>
    <div class="header">{target.head}</div>
    <div class="body">{target.body}</div>
</div>

<style>

    .header {
        font-weight: bold;
        border-radius: 2px;
    }

    .body {
        white-space: pre;
        text-wrap: wrap;
    }

    .card {
        padding: 12px;
        gap: 16px;
        cursor: pointer;
    }

</style>