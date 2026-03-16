import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (tasks) => {

    const worksheet = XLSX.utils.json_to_sheet(tasks);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(data, "tasks.xlsx");
};


export const importFromExcel = (file, setTasks) => {

    const reader = new FileReader();

    reader.onload = (e) => {

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet);

        setTasks(json);
    };

    reader.readAsArrayBuffer(file);
};