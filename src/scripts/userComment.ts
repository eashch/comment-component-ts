/// <reference path="commentsContainer.ts" />

class UserCommentInfo {
    commentID: number;
    authorID: number;
    text: string = '';
    rating: number = 0;
    replyToID: number | null;
    replyToUserID: number | null;
    isFavorite: boolean = false;
    ratingLocalUser: number = 0;
    date: Date;
    replies: number = 0;
};

class UserComment {
    readonly #contentStr = String.raw`
        <div class="comment__main">
            <img class="comment__avatar comments__avatar"></img>
            <div class="comment__block">
                <div class="comment__header">
                    <span class="comment__user-name comments__text-nickname"></span>
                    <button class="button-img-text comment__reply-button-top">
                        <img src="src/images/comments__icon-reply.svg" class="comment__reply-icon-top" alt="arrow" width="22" height="22">
                        <span class="text-gray text-reply-top comment__reply-user-name"></span>
                    </button>
                    <span class="text-small comment__date"></span>
                </div>
                <p class="comment__text"></p>
                <div class="comment__actions-block">
                    <button class="button-img-text comment__reply-button">
                        <img src="src/images/comments__icon-reply.svg" class="comment__reply-icon" alt="arrow" width="22" height="22">
                        <a class="text-gray">Ответить</a>
                    </button>
                    <button class="button-img-text comment__like-button">
                        <img src="src/images/comments__icon-not-liked.svg" class="comment__like-icon" alt="heart" width="20" height="20">
                        <a class="text-gray comment__like-text">В избранное</a>
                    </button>
                    <div class="comment__rating">
                        <button class="button-img comment__rating-button-minus">
                            <img src="src/images/comments__icon-minus.svg" class="comment__like-icon" alt="heart" width="20" height="20">
                        </button>
                        <span class="comment__rating-text"></span>
                        <button class="button-img comment__rating-button-plus">
                            <img src="src/images/comments__icon-plus.svg" class="comment__like-icon" alt="heart" width="20" height="20">
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    readonly #prefix = "comment__";
    readonly #iconLikedSrc = "src/images/comments__icon-like.svg";
    readonly #iconNotLikedSrc = "src/images/comments__icon-not-liked.svg";

    commentID: number;
    author: User; 
    text: string = '';
    rating: number = 0;
    replyToID: number | null = null;
    replyToUser: User | null = null;
    isFavorite: boolean = false;
    ratingLocalUser: number = 0;
    date: Date;
    replies: number = 0;
    #onRatingChanged: (newRating: number) => void;
    #onReplyButtonPressed: (replyToComment: UserComment) => void;
    #onLikedButtonPressed: () => void;

    #containerElement: HTMLElement;

    constructor(commentID: number,
            author: User, 
            text: string, 
            date: Date, 
            replyToID: number | null = null,
            replyToUser: User | null = null,
            rating: number = 0,
            isFavorite: boolean = false,
            ratingLocalUser: number = 0,
            replies: number = 0,
            onRatingChanged: (newRating: number) => void,
            onReplyButtonPressed: (replyToComment: UserComment) => void,
            onLikedButtonPressed: () => void) {
        this.commentID = commentID;
        this.author = author;
        this.text = text;
        this.date = date;
        this.replyToID = replyToID;
        this.replyToUser = replyToUser;
        this.rating = rating;
        this.isFavorite = isFavorite;
        this.ratingLocalUser = ratingLocalUser;
        this.replies = replies;
        this.#onRatingChanged = onRatingChanged;
        this.#onReplyButtonPressed = onReplyButtonPressed;
        this.#onLikedButtonPressed = onLikedButtonPressed;

        this.#containerElement = document.createElement('div');
        this.#containerElement.classList.add(this.#prefix + "container");
        this.#containerElement.innerHTML = this.#contentStr;
        if (replyToID !== null) {
            this.#containerElement.classList.add(
                this.#prefix + "is-reply");
        }

        const avatar: HTMLImageElement 
            = this.#containerElement.querySelector("img");
        avatar.src = this.author.avatarPictureLink;

        const userName: HTMLElement = this.#getElement("user-name");
        userName.innerHTML = this.author.name;

        const textElem: HTMLElement = this.#getElement("text");
        textElem.innerHTML = text;

        
        this.#setReplyDisplay();
        this.#setLikeButton();
        this.#setRatingDisplay();

        const dateElem: HTMLElement = this.#getElement("date");
        dateElem.innerHTML = this.#dateTypeWithZero(date.getDate()) 
            + "." + this.#dateTypeWithZero(date.getMonth() + 1)
            + " " + this.#dateTypeWithZero(date.getHours()) 
            + ":" + this.#dateTypeWithZero(date.getMinutes());
    }

    setOrder(order: number): void {
        this.#containerElement.style.order = order.toString();
    }

    getContainer(): HTMLElement {
        return this.#containerElement;
    }

    getCommentInfo(): UserCommentInfo {
        let info = new UserCommentInfo();
        info.commentID = this.commentID;
        info.authorID = this.author.id;
        info.text = this.text;
        info.date = this.date;
        info.replyToID = this.replyToID;
        info.replyToUserID = this.replyToUser !== null 
            ? this.replyToUser.id : null;
        info.rating = this.rating;
        info.isFavorite = this.isFavorite;
        info.ratingLocalUser = this.ratingLocalUser;
        info.replies = this.replies;
        return info;
    }

    #getElement(suffix: string): HTMLElement {
        return this.#containerElement.querySelector(
                "." + this.#prefix + suffix);
    }

    #dateTypeWithZero(dateType: number): string {
        const dateStr = dateType.toString();
        return dateStr.length < 2
            ? ('0' + dateStr) : dateStr;
    }

    #clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    #setLikeButton(): void {
        const likeButton: HTMLElement = this.#getElement("like-button");
        const likeButtonImg: HTMLImageElement
            = <HTMLImageElement>this.#getElement("like-icon");
        const likeButtonText: HTMLElement = this.#getElement("like-text");
        const setProperties = () => {
            likeButtonImg.src = this.isFavorite
                ? this.#iconLikedSrc
                : this.#iconNotLikedSrc;
            likeButtonText.innerHTML = this.isFavorite
                ? "В избранном"
                : "В избранное";
        };
        likeButton.onclick = () => {
            this.isFavorite = !this.isFavorite;
            setProperties();
            this.#onLikedButtonPressed();
        };
        setProperties();
    }

    #setRatingDisplay(): void {
        const ratingElem: HTMLElement
            = this.#getElement("rating-text");
        ratingElem.innerHTML = this.rating.toString();

        const setTextColor = () => {
            ratingElem.classList.remove("text-rating-up");
            ratingElem.classList.remove("text-rating-down");
            ratingElem.classList.remove("text-rating-neutral");
            ratingElem.classList
                .add("text-rating-" + (this.ratingLocalUser === 0 
                        ? "neutral" 
                        : (this.ratingLocalUser === 1 ? "up" : "down")));
        }

        const setRating = (isPlusOne: boolean): void => {
            const prevValue: number = this.ratingLocalUser;
            this.ratingLocalUser += (isPlusOne ? 1 : -1);
            this.ratingLocalUser =
                this.#clamp(this.ratingLocalUser, -1, 1);
            const diff: number = this.ratingLocalUser - prevValue;
            if (diff == 0)
                return;
            this.rating += diff;
            ratingElem.innerHTML = this.rating.toString();
            setTextColor();
            this.#onRatingChanged(this.rating);
        }

        const ratingPlus: HTMLElement
            = this.#getElement("rating-button-plus");
        ratingPlus.onclick = () => {
            setRating(true);
        };

        const ratingMinus: HTMLElement
            = this.#getElement("rating-button-minus");
        ratingMinus.onclick = () => {
            setRating(false);
        };
        setTextColor();
    }

    #setReplyDisplay() {
        const replyUserName = this.#getElement("reply-user-name");
        replyUserName.style.display 
            = this.replyToID !== null ? '' : 'none';
        replyUserName.innerHTML = this.replyToUser !== null
            ? this.replyToUser.name : '';

        const replyButtonTop = this.#getElement("reply-button-top");
        replyButtonTop.style.display 
            = this.replyToID !== null ? '' : 'none';
        replyButtonTop.style.cursor = "auto";
        const replyButton = this.#getElement("reply-button");
        replyButton.style.display 
            = this.replyToID !== null ? 'none' : '';
        replyButton.onclick = () => {
            this.#onReplyButtonPressed(this);
        };
    }
};