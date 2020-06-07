export class Note {
    id: string;
    noteTitle: string;
    noteContentPlain: string;
    noteContentHtml: string;
    isBookmarked: boolean;
    tags: [];
    createdBy: string;
    createdDate: string;
    updatedDate: string;

    constructor(noteTitle: string, createdBy: string, noteContentPlain?: string,
                noteContentHtml?: string, isBookmarked?: boolean,
                createdDate?: string, updatedDate?: string, id?: string) {
        this.id = id;
        this.noteTitle = noteTitle;
        this.noteContentPlain = noteContentPlain;
        this.noteContentHtml = noteContentHtml;
        this.isBookmarked = false;
        this.tags = [];
        this.createdBy = createdBy;
        this.createdDate = new Date().toISOString();
        this.updatedDate = new Date().toISOString();
    }
}
