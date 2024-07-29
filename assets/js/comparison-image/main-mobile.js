$(document).ready(function($) {
    var dragging = false,
        scrolling = false,
        resizing = false;
    
    // Cache jQuery objects
    var imageComparisonContainers = $('.cd-image-container');

    // Check if the .cd-image-container is in the viewport and animate it
    checkPosition(imageComparisonContainers);
    $(window).on('scroll', function() {
        if (!scrolling) {
            scrolling = true;
            (!window.requestAnimationFrame)
                ? setTimeout(function() { checkPosition(imageComparisonContainers); }, 100)
                : requestAnimationFrame(function() { checkPosition(imageComparisonContainers); });
        }
    });
    
    // Make the .cd-handle element draggable and modify .cd-resize-img width according to its position
    imageComparisonContainers.each(function() {
        var actual = $(this);
        drags(actual.find('.cd-handle'), actual.find('.cd-resize-img'), actual, actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-image-label[data-type="modified"]'));
    });

    // Update images label visibility
    $(window).on('resize', function() {
        if (!resizing) {
            resizing = true;
            (!window.requestAnimationFrame)
                ? setTimeout(function() { checkLabel(imageComparisonContainers); }, 100)
                : requestAnimationFrame(function() { checkLabel(imageComparisonContainers); });
        }
    });

    function checkPosition(container) {
        container.each(function() {
            var actualContainer = $(this);
            if ($(window).scrollTop() + $(window).height() * 0.5 > actualContainer.offset().top) {
                actualContainer.addClass('is-visible');
            }
        });

        scrolling = false;
    }

    function checkLabel(container) {
        container.each(function() {
            var actual = $(this);
            updateLabel(actual.find('.cd-image-label[data-type="modified"]'), actual.find('.cd-resize-img'), 'left');
            updateLabel(actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-resize-img'), 'right');
        });

        resizing = false;
    }

    // Draggable functionality - adapted for touch events
    function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
        const startDrag = (e, isTouch) => {
            dragElement.addClass('draggable');
            resizeElement.addClass('resizable');

            const dragWidth = dragElement.outerWidth(),
                startX = isTouch ? e.touches[0].clientX : e.pageX,
                xPosition = dragElement.offset().left + dragWidth - startX,
                containerOffset = container.offset().left,
                containerWidth = container.outerWidth(),
                minLeft = containerOffset + 10,
                maxLeft = containerOffset + containerWidth - dragWidth - 10;

            const moveEvent = isTouch ? 'touchmove' : 'mousemove';
            const endEvent = isTouch ? 'touchend' : 'mouseup';

            const moveHandler = (e) => {
                if (!dragging) {
                    dragging = true;
                    (!window.requestAnimationFrame)
                        ? setTimeout(function() { animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement); }, 100)
                        : requestAnimationFrame(function() { animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement); });
                }
            };

            const endHandler = () => {
                dragElement.removeClass('draggable');
                resizeElement.removeClass('resizable');
                $(document).off(moveEvent, moveHandler);
                $(document).off(endEvent, endHandler);
            };

            $(document).on(moveEvent, moveHandler);
            $(document).on(endEvent, endHandler);
        };

        dragElement.on('mousedown', (e) => startDrag(e, false));
        dragElement.on('touchstart', (e) => startDrag(e, true));
    }

    function animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement) {
        const moveX = e.touches ? e.touches[0].clientX : e.pageX;
        let leftValue = moveX + xPosition - dragWidth;
        
        // Constrain the draggable element to move inside its container
        if (leftValue < minLeft) {
            leftValue = minLeft;
        } else if (leftValue > maxLeft) {
            leftValue = maxLeft;
        }

        const widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';
        
        $('.draggable').css('left', widthValue).on('mouseup touchend', function() {
            $(this).removeClass('draggable');
            resizeElement.removeClass('resizable');
        });

        $('.resizable').css('width', widthValue);

        updateLabel(labelResizeElement, resizeElement, 'left');
        updateLabel(labelContainer, resizeElement, 'right');
        dragging = false;
    }

    function updateLabel(label, resizeElement, position) {
        if (position === 'left') {
            (label.offset().left + label.outerWidth() < resizeElement.offset().left + resizeElement.outerWidth())
                ? label.removeClass('is-hidden')
                : label.addClass('is-hidden');
        } else {
            (label.offset().left > resizeElement.offset().left + resizeElement.outerWidth())
                ? label.removeClass('is-hidden')
                : label.addClass('is-hidden');
        }
    }
});
