class DropdownComponent {
    readonly #tickMarkImagePath: string = '../src/images/comments__sort-chosen.svg';

    #values: [number, string][];
    #currentValue: number;
    #onValueChanged: (newValue: number) => void;
    #activeElement: HTMLElement | null;
    #optionsTab: HTMLElement | null;
    #optionsVisible: boolean;
    #tickMarks: HTMLImageElement[] = [];

    constructor (values: [number, string][], 
                onValueChanged: (newValue: number) => void, 
                initialValue: (null | number) = null) {
        this.#optionsVisible = false;
        this.#values = values;
        this.#onValueChanged = onValueChanged;
        this.#currentValue = initialValue === null 
                                ? values[0][0]
                                : initialValue;
        this.#activeElement = document.querySelector('.comments__dropdown-active-item');
        this.#optionsTab = document.querySelector('.comments__dropdown-options');
        if (this.#optionsTab)
            this.#optionsTab.style.display = 'none';

        for (let value of values) {
            const option: HTMLDivElement = document.createElement('div');
            const tickMark: HTMLImageElement = document.createElement('img');
            const optionText: HTMLAnchorElement = document.createElement('a');
            optionText.innerHTML = value[1];
            option.appendChild(tickMark);
            option.appendChild(optionText);
            tickMark.src = this.#tickMarkImagePath;
            tickMark.classList.add('comments__dropdown-check-mark');
            if (value[0] !== this.#currentValue) {
                tickMark.style.visibility = 'hidden';
            } else if (this.#activeElement) {
                this.#activeElement.innerHTML = value[1];
            }
            option.classList.add("text-gray");
            this.#optionsTab?.appendChild(option);
            this.#tickMarks.push(tickMark);

            option.addEventListener('click', () => {
                this.#currentValue = value[0];
                if (this.#activeElement)
                    this.#activeElement.innerHTML = value[1];
                this.#tickMarks.forEach(item => {
                    item.style.visibility = 'hidden';
                });
                tickMark.style.visibility = 'visible';
                this.#onValueChanged(this.#currentValue);
                this.#setOptionsVisibility(false);
            });
        }
        
        if (this.#activeElement) {
            this.#activeElement.addEventListener('click', () => {
                this.#setOptionsVisibility(!this.#optionsVisible);
            });
        }
    }

    #setOptionsVisibility(isVisible: boolean): void {
        this.#optionsVisible = isVisible;
        if (this.#optionsTab) {
            this.#optionsTab.style.display 
                = this.#optionsTab.style.display === 'none' 
                    ? 'flex' : 'none';
        }
    }
};