function DragDropInit() {
    const dropzone = document.querySelector('.dropzone');
    const colnum = 5;
    const rownum = 5;
    let check_arr = [];
    const checkArr = document.querySelector('.check-arr');
    document.documentElement.style.setProperty('--col-num', `${colnum}`);
    document.documentElement.style.setProperty('--row-num', `${rownum}`);
    for (let i = 0; i < rownum * colnum; i++) {
        dropzone.innerHTML += '<div></div>';
    }

    createDraggable('draggable1', 1, 1);
    createDraggable('draggable2', 1, 2);
    createDraggable('draggable3', 1, 3);
    createDraggable('draggable4', 2, 1);
    createDraggable('draggable5', 2, 2);
    createDraggable('draggable6', 3, 1);
    draggableObj(document.getElementById('draggable1'), 1, 1);
    draggableObj(document.getElementById('draggable2'), 1, 2);
    draggableObj(document.getElementById('draggable3'), 1, 3);
    draggableObj(document.getElementById('draggable4'), 2, 1);
    draggableObj(document.getElementById('draggable5'), 2, 2);
    draggableObj(document.getElementById('draggable6'), 3, 1);

    function createDraggable(draggableID, rW, rH) {
        const draggable = document.createElement('div');
        draggable.className = `draggable${rW}-${rH}`;
        draggable.id = draggableID;
        document.querySelector('.dropbase').appendChild(draggable);
        console.log(draggableID);
    }

    function draggableObj(draggable, rW, rH) {
        console.log('last');
        const draggables = document.querySelectorAll('.draggable1-1, .draggable1-2, .draggable1-3, .draggable2-1, .draggable2-2, .draggable3-1');
        const dropbase = document.querySelector('.dropbase');
        const dropzone = document.querySelector('.dropzone');
        let offsetX, offsetY, initialX, initialY;
        let ismousedown = false;

        draggable.addEventListener('touchstart', (e) => {
            draggables.forEach(element => {
                element.style.zIndex = 1;
            });
            e.target.style.zIndex = 3;
            e.target.style.opacity = '';
            e.target.style.backgroundColor = 'transparent';
            const touch = e.touches[0];
            initialX = draggable.offsetLeft;
            initialY = draggable.offsetTop;
            offsetX = touch.clientX - initialX;
            offsetY = touch.clientY - initialY;
            check_arr = check_arr.filter(item => item !== e.target.id);
            console.log(check_arr);
            checkArr.innerHTML = check_arr;
        });
        draggable.addEventListener('mousedown', (e) => {
            ismousedown = true;
            draggables.forEach(element => {
                element.style.zIndex = 1;
            });
            e.target.style.zIndex = 3;
            e.target.style.opacity = '';
            e.target.style.backgroundColor = 'transparent';
            initialX = draggable.offsetLeft;
            initialY = draggable.offsetTop;
            offsetX = e.clientX - initialX;
            offsetY = e.clientY - initialY;
            check_arr = check_arr.filter(item => item !== e.target.id);
            console.log(check_arr);
            checkArr.innerHTML = check_arr;
        });

        draggable.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            let newX = touch.clientX - offsetX;
            let newY = touch.clientY - offsetY;
            const objectWidth = parseInt(getComputedStyle(e.target).getPropertyValue('width'));
            const objectHeight = parseInt(getComputedStyle(e.target).getPropertyValue('height'));
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            // 保證物件在視窗範圍內
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + objectWidth > windowWidth - 20) {
                newX = windowWidth - 20 - objectWidth;
            }
            if (newY + objectHeight > windowHeight - 20) {
                newY = windowHeight - 20 - objectHeight;
            }
            draggable.style.left = `${newX}px`;
            draggable.style.top = `${newY}px`;
            // 检查是否有包含 dropzone 里面 div 小格子的中心点的八个偏移点
            const dropzone = document.querySelector('.dropzone');
            const dropzoneCells = dropzone.children;

            for (const cell of dropzoneCells) {
                const cellRect = cell.getBoundingClientRect();
                const cellCenterX = cellRect.left + cellRect.width / 2;
                const cellCenterY = cellRect.top + cellRect.height / 2;

                // 偏移量
                const offset = 5;

                // 八个偏移点
                const points = [
                    { x: cellCenterX, y: cellCenterY - offset }, // 上
                    { x: cellCenterX, y: cellCenterY + offset }, // 下
                    { x: cellCenterX - offset, y: cellCenterY }, // 左
                    { x: cellCenterX + offset, y: cellCenterY }, // 右
                    { x: cellCenterX - offset, y: cellCenterY - offset }, // 左上
                    { x: cellCenterX + offset, y: cellCenterY - offset }, // 右上
                    { x: cellCenterX - offset, y: cellCenterY + offset }, // 左下
                    { x: cellCenterX + offset, y: cellCenterY + offset } // 右下
                ];

                let isCovered = false;

                for (const point of points) {
                    if (
                        point.x >= newX &&
                        point.x <= newX + objectWidth &&
                        point.y >= newY &&
                        point.y <= newY + objectHeight
                    ) {
                        isCovered = true;
                        break;
                    }
                }

                if (isCovered) {
                    cell.style.backgroundColor = '#0a05';
                    const draggableRect = draggable.getBoundingClientRect();
                    const dropbaseRect = dropbase.getBoundingClientRect();
                    const dropzoneRect = dropzone.getBoundingClientRect();

                    const cellWidth = (dropzoneRect.width - (30 + ((colnum - 4) * 10))) / colnum;
                    const cellHeight = (dropzoneRect.height - (30 + ((rownum - 4) * 10))) / rownum;
                    const requiredWidth = rW;
                    const requiredHeight = rH;

                    const dropzoneCol = Math.floor((draggableRect.left - dropbaseRect.left) / (cellWidth - 3));
                    const dropzoneRow = Math.floor((draggableRect.top - dropbaseRect.top) / (cellHeight + 3));
                    const targetLeft = dropzoneCol * (cellWidth + 10);
                    const targetTop = dropzoneRow * (cellHeight + 10);
                    draggables.forEach((other) => {
                        if (other !== draggable) {
                            const otherRect = other.getBoundingClientRect();
                            if (
                                targetLeft < otherRect.left + otherRect.width &&
                                targetLeft + draggableRect.width > otherRect.left &&
                                targetTop < otherRect.top + otherRect.height &&
                                targetTop + draggableRect.height > otherRect.top
                            ) {
                                cell.style.backgroundColor = '#a005';
                            }
                        }
                    });
                } else {
                    cell.style.backgroundColor = ''; // 还原背景颜色
                }
            }
        });
        draggable.addEventListener('mousemove', (e) => {
            if (!ismousedown)
                return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            const objectWidth = parseInt(getComputedStyle(e.target).getPropertyValue('width'));
            const objectHeight = parseInt(getComputedStyle(e.target).getPropertyValue('height'));
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            // 保證物件在視窗範圍內
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + objectWidth > windowWidth - 20) {
                newX = windowWidth - 20 - objectWidth;
            }
            if (newY + objectHeight > windowHeight - 20) {
                newY = windowHeight - 20 - objectHeight;
            }
            draggable.style.left = `${newX}px`;
            draggable.style.top = `${newY}px`;
            // 检查是否有包含 dropzone 里面 div 小格子的中心点的八个偏移点
            const dropzone = document.querySelector('.dropzone');
            const dropzoneCells = dropzone.children;

            for (const cell of dropzoneCells) {
                const cellRect = cell.getBoundingClientRect();
                const cellCenterX = cellRect.left + cellRect.width / 2;
                const cellCenterY = cellRect.top + cellRect.height / 2;

                // 偏移量
                const offset = 5;

                // 八个偏移点
                const points = [
                    { x: cellCenterX, y: cellCenterY - offset }, // 上
                    { x: cellCenterX, y: cellCenterY + offset }, // 下
                    { x: cellCenterX - offset, y: cellCenterY }, // 左
                    { x: cellCenterX + offset, y: cellCenterY }, // 右
                    { x: cellCenterX - offset, y: cellCenterY - offset }, // 左上
                    { x: cellCenterX + offset, y: cellCenterY - offset }, // 右上
                    { x: cellCenterX - offset, y: cellCenterY + offset }, // 左下
                    { x: cellCenterX + offset, y: cellCenterY + offset } // 右下
                ];

                let isCovered = false;

                for (const point of points) {
                    if (
                        point.x >= newX &&
                        point.x <= newX + objectWidth &&
                        point.y >= newY &&
                        point.y <= newY + objectHeight
                    ) {
                        isCovered = true;
                        break;
                    }
                }

                if (isCovered) {
                    cell.style.backgroundColor = '#0a05';
                    const draggableRect = draggable.getBoundingClientRect();
                    const dropbaseRect = dropbase.getBoundingClientRect();
                    const dropzoneRect = dropzone.getBoundingClientRect();

                    const cellWidth = (dropzoneRect.width - (30 + ((colnum - 4) * 10))) / colnum;
                    const cellHeight = (dropzoneRect.height - (30 + ((rownum - 4) * 10))) / rownum;
                    const requiredWidth = rW;
                    const requiredHeight = rH;

                    const dropzoneCol = Math.floor((draggableRect.left - dropbaseRect.left) / (cellWidth - 3));
                    const dropzoneRow = Math.floor((draggableRect.top - dropbaseRect.top) / (cellHeight + 3));
                    const targetLeft = dropzoneCol * (cellWidth + 10);
                    const targetTop = dropzoneRow * (cellHeight + 10);
                    draggables.forEach((other) => {
                        if (other !== draggable) {
                            const otherRect = other.getBoundingClientRect();
                            if (
                                targetLeft < otherRect.left + otherRect.width &&
                                targetLeft + draggableRect.width > otherRect.left &&
                                targetTop < otherRect.top + otherRect.height &&
                                targetTop + draggableRect.height > otherRect.top
                            ) {
                                cell.style.backgroundColor = '#a005';
                            }
                        }
                    });
                } else {
                    cell.style.backgroundColor = ''; // 还原背景颜色
                }
            }
        });

        draggable.addEventListener('touchend', (e) => {
            // 检查是否有包含 dropzone 里面 div 小格子的中心点
            const dropzone = document.querySelector('.dropzone');
            const dropzoneCells = dropzone.children;

            for (const cell of dropzoneCells) {
                cell.style.backgroundColor = ''; // 还原背景颜色
            }
            const draggableRect = draggable.getBoundingClientRect();
            const dropbaseRect = dropbase.getBoundingClientRect();
            const dropzoneRect = dropzone.getBoundingClientRect();

            const cellWidth = (dropzoneRect.width - (30 + ((colnum - 4) * 10))) / colnum;
            const cellHeight = (dropzoneRect.height - (30 + ((rownum - 4) * 10))) / rownum;
            const requiredWidth = rW;
            const requiredHeight = rH;

            const dropzoneCol = Math.floor((draggableRect.left - dropbaseRect.left) / (cellWidth - 3));
            const dropzoneRow = Math.floor((draggableRect.top - dropbaseRect.top) / (cellHeight + 3));

            const targetLeft = dropzoneCol * (cellWidth + 10);
            const targetTop = dropzoneRow * (cellHeight + 10);

            // 檢查是否與其他物件重疊
            let isOverlap = false;
            draggables.forEach((other) => {
                if (other !== draggable) {
                    const otherRect = other.getBoundingClientRect();
                    if (
                        targetLeft < otherRect.left + otherRect.width &&
                        targetLeft + draggableRect.width > otherRect.left &&
                        targetTop < otherRect.top + otherRect.height &&
                        targetTop + draggableRect.height > otherRect.top
                    ) {
                        isOverlap = true;
                    }
                }
            });

            if (
                dropzoneCol + requiredWidth <= colnum &&
                dropzoneRow + requiredHeight <= rownum &&
                !isOverlap
            ) {
                draggable.style.left = `${targetLeft}px`;
                draggable.style.top = `${targetTop}px`;
                if (!check_arr.includes(e.target.id)) {
                    check_arr.push(e.target.id);
                }
                e.target.style.zIndex = 1;
                e.target.style.opacity = 1;
                e.target.style.backgroundColor = 'transparent';
                console.log(check_arr);
                checkArr.innerHTML = check_arr;
            } else if (dropzoneCol + requiredWidth <= colnum && dropzoneRow + requiredHeight <= rownum) {
                // 優先尋找放下位置附近的格子
                const nearbyPositions = [];
                for (let rowOffset = 0; rowOffset < rownum; rowOffset++) {
                    for (let colOffset = 0; colOffset < colnum; colOffset++) {
                        const row = dropzoneRow + rowOffset;
                        const col = dropzoneCol + colOffset;
                        if (row >= 0 && row <= rownum - requiredHeight && col >= 0 && col <= colnum - requiredWidth) {
                            nearbyPositions.push({
                                row,
                                col,
                                distance: Math.sqrt(
                                    Math.pow(row - dropzoneRow, 2) + Math.pow(col - dropzoneCol, 2)
                                ),
                            });
                        }
                    }
                }

                // 根據距離排序位置
                nearbyPositions.sort((a, b) => a.distance - b.distance);

                let foundSpot = false;
                for (let pos of nearbyPositions) {
                    let spotAvailable = true;
                    draggables.forEach((other) => {
                        if (other !== draggable) {
                            const otherRect = other.getBoundingClientRect();
                            const checkLeft = pos.col * (cellWidth + 10);
                            const checkTop = pos.row * (cellHeight + 10);
                            if (
                                checkLeft < otherRect.left + otherRect.width &&
                                checkLeft + draggableRect.width > otherRect.left &&
                                checkTop < otherRect.top + otherRect.height &&
                                checkTop + draggableRect.height > otherRect.top
                            ) {
                                spotAvailable = false;
                            }
                        }
                    });
                    if (spotAvailable) {
                        draggable.style.left = `${pos.col * (cellWidth + 10)}px`;
                        draggable.style.top = `${pos.row * (cellHeight + 10)}px`;
                        foundSpot = true;
                        if (!check_arr.includes(e.target.id)) {
                            check_arr.push(e.target.id);
                        }
                        e.target.style.zIndex = 1;
                        e.target.style.opacity = 1;
                        e.target.style.backgroundColor = 'transparent';
                        console.log(check_arr);
                        checkArr.innerHTML = check_arr;
                        break;
                    }
                }

                if (!foundSpot) {
                    // 如果附近找不到合適的位置，則從整個網格中尋找
                    for (let row = 0; row <= rownum - requiredHeight; row++) {
                        for (let col = 0; col <= colnum - requiredWidth; col++) {
                            let spotAvailable = true;
                            draggables.forEach((other) => {
                                if (other !== draggable) {
                                    const otherRect = other.getBoundingClientRect();
                                    const checkLeft = col * (cellWidth + 10);
                                    const checkTop = row * (cellHeight + 10);
                                    if (
                                        checkLeft < otherRect.left + otherRect.width &&
                                        checkLeft + draggableRect.width > otherRect.left &&
                                        checkTop < otherRect.top + otherRect.height &&
                                        checkTop + draggableRect.height > otherRect.top
                                    ) {
                                        spotAvailable = false;
                                    }
                                }
                            });
                            if (spotAvailable) {
                                draggable.style.left = `${col * (cellWidth + 10)}px`;
                                draggable.style.top = `${row * (cellHeight + 10)}px`;
                                if (!check_arr.includes(e.target.id)) {
                                    check_arr.push(e.target.id);
                                }
                                e.target.style.zIndex = 1;
                                e.target.style.opacity = 1;
                                e.target.style.backgroundColor = 'transparent';
                                console.log(check_arr);
                                checkArr.innerHTML = check_arr;
                                return;
                            } else {
                                check_arr = check_arr.filter(item => item !== e.target.id);
                                e.target.style.zIndex = '';
                                e.target.style.opacity = '';
                                e.target.style.backgroundColor = '';
                                console.log(check_arr);
                                checkArr.innerHTML = check_arr;
                                return;
                            }
                        }
                    }
                }
            } else {
                check_arr = check_arr.filter(item => item !== e.target.id);
                e.target.style.zIndex = '';
                e.target.style.opacity = 0.8;
                e.target.style.backgroundColor = '#f003';
                console.log(check_arr);
                checkArr.innerHTML = check_arr;
            }
        });
        document.body.addEventListener('mouseup', () => {
            ismousedown = false;
        });
        draggable.addEventListener('mouseup', (e) => {
            // 检查是否有包含 dropzone 里面 div 小格子的中心点
            const dropzone = document.querySelector('.dropzone');
            const dropzoneCells = dropzone.children;

            for (const cell of dropzoneCells) {
                cell.style.backgroundColor = ''; // 还原背景颜色
            }
            const draggableRect = draggable.getBoundingClientRect();
            const dropbaseRect = dropbase.getBoundingClientRect();
            const dropzoneRect = dropzone.getBoundingClientRect();

            const cellWidth = (dropzoneRect.width - (30 + ((colnum - 4) * 10))) / colnum;
            const cellHeight = (dropzoneRect.height - (30 + ((rownum - 4) * 10))) / rownum;
            const requiredWidth = rW;
            const requiredHeight = rH;

            const dropzoneCol = Math.floor((draggableRect.left - dropbaseRect.left) / (cellWidth - 3));
            const dropzoneRow = Math.floor((draggableRect.top - dropbaseRect.top) / (cellHeight + 3));

            const targetLeft = dropzoneCol * (cellWidth + 10);
            const targetTop = dropzoneRow * (cellHeight + 10);

            // 檢查是否與其他物件重疊
            let isOverlap = false;
            draggables.forEach((other) => {
                if (other !== draggable) {
                    const otherRect = other.getBoundingClientRect();
                    if (
                        targetLeft < otherRect.left + otherRect.width &&
                        targetLeft + draggableRect.width > otherRect.left &&
                        targetTop < otherRect.top + otherRect.height &&
                        targetTop + draggableRect.height > otherRect.top
                    ) {
                        isOverlap = true;
                    }
                }
            });

            if (
                dropzoneCol + requiredWidth <= colnum &&
                dropzoneRow + requiredHeight <= rownum &&
                !isOverlap
            ) {
                draggable.style.left = `${targetLeft}px`;
                draggable.style.top = `${targetTop}px`;
                if (!check_arr.includes(e.target.id)) {
                    check_arr.push(e.target.id);
                }
                e.target.style.zIndex = 1;
                e.target.style.opacity = 1;
                e.target.style.backgroundColor = 'transparent';
                console.log(check_arr);
                checkArr.innerHTML = check_arr;
            } else if (dropzoneCol + requiredWidth <= colnum && dropzoneRow + requiredHeight <= rownum) {
                // 優先尋找放下位置附近的格子
                const nearbyPositions = [];
                for (let rowOffset = 0; rowOffset < rownum; rowOffset++) {
                    for (let colOffset = 0; colOffset < colnum; colOffset++) {
                        const row = dropzoneRow + rowOffset;
                        const col = dropzoneCol + colOffset;
                        if (row >= 0 && row <= rownum - requiredHeight && col >= 0 && col <= colnum - requiredWidth) {
                            nearbyPositions.push({
                                row,
                                col,
                                distance: Math.sqrt(
                                    Math.pow(row - dropzoneRow, 2) + Math.pow(col - dropzoneCol, 2)
                                ),
                            });
                        }
                    }
                }

                // 根據距離排序位置
                nearbyPositions.sort((a, b) => a.distance - b.distance);

                let foundSpot = false;
                for (let pos of nearbyPositions) {
                    let spotAvailable = true;
                    draggables.forEach((other) => {
                        if (other !== draggable) {
                            const otherRect = other.getBoundingClientRect();
                            const checkLeft = pos.col * (cellWidth + 10);
                            const checkTop = pos.row * (cellHeight + 10);
                            if (
                                checkLeft < otherRect.left + otherRect.width &&
                                checkLeft + draggableRect.width > otherRect.left &&
                                checkTop < otherRect.top + otherRect.height &&
                                checkTop + draggableRect.height > otherRect.top
                            ) {
                                spotAvailable = false;
                            }
                        }
                    });
                    if (spotAvailable) {
                        draggable.style.left = `${pos.col * (cellWidth + 10)}px`;
                        draggable.style.top = `${pos.row * (cellHeight + 10)}px`;
                        foundSpot = true;
                        if (!check_arr.includes(e.target.id)) {
                            check_arr.push(e.target.id);
                        }
                        e.target.style.zIndex = 1;
                        e.target.style.opacity = 1;
                        e.target.style.backgroundColor = 'transparent';
                        console.log(check_arr);
                        checkArr.innerHTML = check_arr;
                        break;
                    }
                }

                if (!foundSpot) {
                    // 如果附近找不到合適的位置，則從整個網格中尋找
                    for (let row = 0; row <= rownum - requiredHeight; row++) {
                        for (let col = 0; col <= colnum - requiredWidth; col++) {
                            let spotAvailable = true;
                            draggables.forEach((other) => {
                                if (other !== draggable) {
                                    const otherRect = other.getBoundingClientRect();
                                    const checkLeft = col * (cellWidth + 10);
                                    const checkTop = row * (cellHeight + 10);
                                    if (
                                        checkLeft < otherRect.left + otherRect.width &&
                                        checkLeft + draggableRect.width > otherRect.left &&
                                        checkTop < otherRect.top + otherRect.height &&
                                        checkTop + draggableRect.height > otherRect.top
                                    ) {
                                        spotAvailable = false;
                                    }
                                }
                            });
                            if (spotAvailable) {
                                draggable.style.left = `${col * (cellWidth + 10)}px`;
                                draggable.style.top = `${row * (cellHeight + 10)}px`;
                                if (!check_arr.includes(e.target.id)) {
                                    check_arr.push(e.target.id);
                                }
                                e.target.style.zIndex = 1;
                                e.target.style.opacity = 1;
                                e.target.style.backgroundColor = 'transparent';
                                console.log(check_arr);
                                checkArr.innerHTML = check_arr;
                                return;
                            } else {
                                check_arr = check_arr.filter(item => item !== e.target.id);
                                e.target.style.zIndex = '';
                                e.target.style.opacity = '';
                                e.target.style.backgroundColor = '';
                                console.log(check_arr);
                                checkArr.innerHTML = check_arr;
                                return;
                            }
                        }
                    }
                }
            } else {
                check_arr = check_arr.filter(item => item !== e.target.id);
                e.target.style.zIndex = '';
                e.target.style.opacity = 0.8;
                e.target.style.backgroundColor = '#f003';
                console.log(check_arr);
                checkArr.innerHTML = check_arr;
            }
        });
    }
}
DragDropInit();