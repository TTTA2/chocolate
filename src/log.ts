import * as monaco from 'monaco-editor';

export interface TextModel {
    id: string,
    model: monaco.editor.ITextModel,
}

export const craeteTextModel = (id: string, textBody: string, onChangeContent?: (textModel: TextModel) => void): TextModel => {

    const model = monaco.editor.createModel(textBody, "hl");
    const textModel: TextModel = { id, model };
    model.onDidChangeContent((event) => onChangeContent?.call(undefined, textModel));

    return textModel;
}

export interface Talk {
    head: string,
    body: string,
    id: string,
}

export interface LogItem {

    title: string,
    talkItems: Talk[],
    id: string,
}

export const LogToText = (targetItem: LogItem) => {
    return targetItem.talkItems
    .map(talk => talk.body.length > 0 ? `${talk.head})${talk.body}` : "")
    .filter(item => item.length > 0)
    .join("\n\n");
}

export interface LogCollection {

    items: LogItem[],
}

export interface Template {
    label: string,
    body: [
        {
            turn: string,
            text: string,
        }
    ]
}

export const a = () => {

}