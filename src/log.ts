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

export interface LogCollection {

    logItems: LogItem[],


}

export const a = () => {

}