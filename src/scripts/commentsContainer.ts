enum CommentSortTypes {
    ByDate,
    ByRating,
    ByRelevance,
    ByReplies
}

class CommentsContainer {
    commentID: number | null = null;
    #comments: UserComment[] = [];
    #containerElement: HTMLElement;

    constructor(containerElement: HTMLElement, 
            commentID: (number | null) = null) {
        this.#containerElement = containerElement;
        this.commentID = commentID;
    }

    addComment(newComment: UserComment): void {
        this.#comments.push(newComment);
        this.#containerElement.appendChild(newComment.getContainer());
    }

    sort(sortType: CommentSortTypes,
            sortFromLowestToHighest: boolean): void {
        switch(sortType) {
            case CommentSortTypes.ByDate:
                this.#sortByDate(sortFromLowestToHighest);
                break;
            case CommentSortTypes.ByRating:
                this.#sortByRating(sortFromLowestToHighest);
                break;
            case CommentSortTypes.ByRelevance:
                this.#sortByRelevance(sortFromLowestToHighest);
                break;
            case CommentSortTypes.ByReplies:
                this.#sortByReplies(sortFromLowestToHighest);
                break;
        };
    }

    changeSortDirection(sortFromLowestToHighest: boolean): void {
        this.#comments.forEach(
            (item, index) => item.setOrder(sortFromLowestToHighest 
                ? index : (this.#comments.length - index)));
    }

    getNumberOfComments(): number {
        return this.#comments.length;
    }

    showLikedOnly(likedOnly: boolean): void {
        this.#comments.forEach(item => {
            item.getContainer().style.display = likedOnly
                ? (item.isFavorite ? "flex" : "none") 
                : "flex";
        });
    }

    #sortByRating(sortFromLowestToHighest: boolean): void {
        if (this.#comments.length === 0)
            return;
        this.#comments.sort((a, b) => {
            return b.rating - a.rating;
        });
        this.changeSortDirection(sortFromLowestToHighest);
    }

    #sortByDate(sortFromLowestToHighest: boolean): void {
        if (this.#comments.length === 0)
            return;
        this.#comments.sort((a, b) => {
            return b.date.getTime() - a.date.getTime();
        });
        this.changeSortDirection(sortFromLowestToHighest);
    }

    #sortByReplies(sortFromLowestToHighest: boolean): void {
        if (this.#comments.length === 0)
            return;
        this.#comments.sort((a, b) => {
            return b.replies- a.replies;
        });
        this.changeSortDirection(sortFromLowestToHighest);
    }

    #sortByRelevance(sortFromLowestToHighest: boolean): void {
        if (this.#comments.length === 0)
            return;
        this.#comments.sort((a, b) => {
            return b.commentID - a.commentID;
        });
        this.changeSortDirection(sortFromLowestToHighest);
    }
}