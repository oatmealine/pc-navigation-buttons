const { Plugin } = require('powercord/entities');

const TITLE_BAR_CLASSES = 'typeWindows-2-g3UY withFrame-2dL45i titleBar-1it3bQ horizontalReverse-2QssvL flex-3BkGQD directionRowReverse-HZatnx justifyStart-2Mwniq alignStretch-Uwowzr';
const INSERT_AT = '.flexCenter-1Mwsxg.flex-3BkGQD.justifyCenter-rrurWZ.alignCenter-14kD11:last-child';
const COPY_BUTTON = '.winButtonMinMax-3RsPUg.winButton-3UMjdg';

// nabbed from https://feathericons.com/
const ICON_LEFT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>';
const ICON_RIGHT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2  " stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>';

module.exports = class NavigationButtons extends Plugin {
	startPlugin() {
        this.addButtons();

        this.observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                mutation.removedNodes.forEach(removedNode => {
                    if (removedNode.className === TITLE_BAR_CLASSES) {
                        setTimeout(() => {
                            this.addButtons();
                        }, 1000);
                    }
                });
            });
        });

        this.observer.observe(document.getElementById('app-mount'), {childList: true, subtree: false});
	}

    createButtonContainer() {
        const insertAt = document.querySelector(INSERT_AT);
        
        if (!insertAt) {
            console.error('couldn\'t find title bar buttons!');
            console.log(INSERT_AT);
            return;
        }

        const container = document.createElement('div');
        container.id = 'powercordNavigationButtons-container';
        container.style = 'flex-grow: 1; display: flex; justify-content: flex-start; padding-left: 73px'
        
        this.container = insertAt.parentElement.insertBefore(container, insertAt.nextSibling);
    }

    addButton(left) {
        const copyButton = document.querySelector(COPY_BUTTON);

        if (!this.container) {
            console.error('couldn\'t find button container!');
            return;
        }
        if (!copyButton) {
            console.error('couldn\'t find title bar buttons!?');
            console.log(COPY_BUTTON);
            return;
        }

        const button = document.createElement('div');

        button.id = `powercordNavigationButtons-button-${left ? 'left' : 'right'}`;
        button.classList = copyButton.classList;
        button.innerHTML = `${left ? ICON_LEFT : ICON_RIGHT}`;

        button.onclick = () => {
            history.go(left ? -1 : 1);
        }

        if (left) {
            this.navButtonLeft = this.container.appendChild(button);
        } else {
            this.navButtonRight = this.container.appendChild(button);
        }
    }

    addButtons() {
        this.createButtonContainer();
        this.addButton(true);
        this.addButton(false);
    }

	pluginWillUnload() {
        if (this.navButtonLeft) this.navButtonLeft.remove();
        if (this.navButtonRight) this.navButtonRight.remove();
        if (this.observer) this.observer.disconnect();
	}
}