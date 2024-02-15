export  const addRow = (setRowData) => { setRowData((prevRows) => [...prevRows, {} ]) };

export const formatDateString = (dateStr) => {
    const dateParts = dateStr.split('.');
    return `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
};