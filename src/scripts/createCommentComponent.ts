/// <reference path="user.ts" />

class CreateCommentComponent {
    readonly #prefix: string = "create-comment__";
    readonly #symbolsMaximumNumber: number = 100;
    #userNameElement: HTMLSpanElement;
    #userAvatarElement: HTMLImageElement;
    #inputElement: HTMLTextAreaElement;
    #symbolsCountElement: HTMLSpanElement;
    #errorElement: HTMLSpanElement;
    #submitButtonElement: HTMLButtonElement;
    #replyToComment: UserComment | null = null;
    #validComment: boolean = false;

    constructor(localUser: User, 
        onSubmitNewCommit: (text: string, replyToComment: UserComment | null) => void) {
        this.#userNameElement = document.querySelector(
            '.' + this.#prefix + "user-name");
        this.#userAvatarElement = document.querySelector(
            '.' + this.#prefix + "avatar");
        this.#inputElement = document.querySelector(
            '.' + this.#prefix + "input");
        this.#symbolsCountElement = document.querySelector(
            '.' + this.#prefix + "symbols-count");
        this.#errorElement = document.querySelector(
            '.' + this.#prefix + "error");
        this.#submitButtonElement = document.querySelector(
            '.' + this.#prefix + "submit");

        this.#userNameElement.innerHTML = localUser.name;
        this.#userAvatarElement.src = localUser.avatarPictureLink;
        this.#submitButtonElement.onclick = () => {
            if (!this.#validComment)
                return;
            onSubmitNewCommit(this.#inputElement.value,
                        this.#replyToComment);
            this.#inputElement.value = '';
            this.#replyToComment = null;
            this.#onTextValueChanged();
        };
        this.#inputElement.oninput = () => {
            this.#onTextValueChanged();
        };
        this.#onTextValueChanged(); 
    }

    #onTextValueChanged() {
        this.#inputElement.style.height = "0px";
        this.#inputElement.style.height = (this.#inputElement.scrollHeight) + "px";
        const symbolsCount = this.#inputElement.value.length;
        this.#symbolsCountElement.textContent
            = `${symbolsCount}/${this.#symbolsMaximumNumber}`;
        this.#validComment = false;
        if (symbolsCount > 0
            && symbolsCount < this.#symbolsMaximumNumber) {
            this.#symbolsCountElement.classList.remove(
                "text-error");
            this.#submitButtonElement.classList.add(
                this.#prefix + "submit-active");
            this.#errorElement.textContent = "";
            this.#validComment = true;
        } else if (symbolsCount === 0) {
            this.#symbolsCountElement.textContent
                = `Макс. ${this.#symbolsMaximumNumber} символов`;
            this.#submitButtonElement.classList.remove(
                this.#prefix + "submit-active");
            this.#symbolsCountElement.classList.remove(
                "text-error");
            this.#errorElement.textContent = "";
        } else if (symbolsCount >= this.#symbolsMaximumNumber) {
            this.#submitButtonElement.classList.remove(
                this.#prefix + "submit-active");
            this.#symbolsCountElement.classList.add(
                "text-error");
            this.#errorElement.textContent = "Слишком длинное сообщение";
        }
    }

    setReplyTo(replyToComment: UserComment) {
        this.#replyToComment = replyToComment;
    }
};