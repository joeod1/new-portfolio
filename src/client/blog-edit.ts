import * as monaco from "monaco-editor";
import * as marked from "marked";

import {BlogUpdate} from "../common/blog-interfaces";

// Get the initial content from the DOM (presumably passed through by the templating tool)
const initialContent = document.getElementById("initialContent").textContent;
// Save the current content outside of the editor
let content = initialContent;

// Initialize the editor
const editor = monaco.editor.create(document.getElementById('editor'), {
    value: initialContent,  // Use the same DOM-provided intial content
    language: 'markdown', 
    theme: 'vs-dark',
    wordWrap: "on",  // Wrap text if it's too long; this isn't code
    minimap: {
        enabled: false  // Disable the minimap; it gets in the way
    }
});

// Re-render the markdown to the article
async function render() {
    content = editor.getValue();
    document.getElementById("content").innerHTML = await marked.parse(content);
    editor.layout();
}
// ... upon initialization
render();
// ... upon edits
editor.getModel().onDidChangeContent(render);

const title = document.getElementById("title") as HTMLInputElement;
const series = document.getElementById("series") as HTMLInputElement;
const id = document.getElementById("id") as HTMLInputElement;
const saveButton = document.getElementById("saveButton") as HTMLLinkElement;

// Save the changes to the server
async function save() {
    const payload: BlogUpdate = {
        id: Number.parseInt(id.value),
        title: title.value,
        series: series.value,
        content: editor.getValue()
    };

    saveButton.disabled = true;

    const resp = await fetch(`/blog/${id}/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    saveButton.disabled = false;

    if (resp.ok) {
        console.log("Saved succesfully");
    } else {
        console.log(resp.statusText);
    }
}

saveButton.addEventListener("click", save);
document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        save();
    }
});