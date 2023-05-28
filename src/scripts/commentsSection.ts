/// <reference path="commentsContainer.ts" />
/// <reference path="dropdownComponent.ts" />
/// <reference path="userComment.ts" />
/// <reference path="createCommentComponent.ts" />
/// <reference path="user.ts" />

class CommentsSection extends CommentsContainer {
    readonly #commentStorePrefix: string = "comment-";
    #users: User[] = [];
    #dropdownComponent: DropdownComponent;
    #sortFromLowestToHighest = false;
    #commentsContainer: HTMLElement;
    #sortDirectionElement: HTMLButtonElement;
    #sortType: CommentSortTypes = CommentSortTypes.ByDate;
    #showLikedElement: HTMLButtonElement;
    #isShowingLiked: boolean = false;
    #localUser: User;
    #createCommentComponent: CreateCommentComponent;
    #nextCommentID: number = 0;
    #numberOfCommentsElement: HTMLSpanElement;

    constructor() {
        //localStorage.clear();
        const commentsContainer = <HTMLElement>document.querySelector(
                                    ".comments__container");
        super(commentsContainer);
        this.#commentsContainer = commentsContainer;
        this.#sortDirectionElement = document.querySelector(
            ".comments__sort-direction");
        this.#sortDirectionElement.addEventListener('click', () => {
            this.#sortFromLowestToHighest = !this.#sortFromLowestToHighest;
            if (this.#sortFromLowestToHighest) {
                this.#sortDirectionElement.firstElementChild
                    .classList.remove("comments__option-arrow-up");
                this.#sortDirectionElement.firstElementChild
                    .classList.add("comments__option-arrow-down");
            } else {
                this.#sortDirectionElement.firstElementChild
                    .classList.remove("comments__option-arrow-down");
                this.#sortDirectionElement.firstElementChild
                    .classList.add("comments__option-arrow-up");
            }
            this.sort(this.#sortType, this.#sortFromLowestToHighest);
        });

        this.#showLikedElement = document.querySelector(".comments__show-liked");
        this.#showLikedElement.addEventListener('click', () => {
            this.#isShowingLiked = !this.#isShowingLiked;
            this.showLikedOnly(this.#isShowingLiked);
        });

        this.#numberOfCommentsElement
            = document.querySelector(".comments__number");
        
        this.#dropdownComponent = new DropdownComponent([
            [CommentSortTypes.ByDate, "По дате"], 
            [CommentSortTypes.ByRating, "По количеству оценок"], 
            [CommentSortTypes.ByRelevance, "По актуальности"], 
            [CommentSortTypes.ByReplies, "По количеству ответов"]],
            (newSortType) => {
                this.#sortType = newSortType;
                this.sort(this.#sortType, this.#sortFromLowestToHighest);
            }
        );

        if (localStorage.length === 0)
            this.#generateDummyComments();
        else
            this.#loadFromLocalStorage();
        
        this.#createCommentComponent = new CreateCommentComponent(this.#localUser, 
            (text: string, replyToComment: UserComment | null) => {
                if (replyToComment !== null) {
                    replyToComment.replies++;
                    this.#saveCommentToLocalStorage(replyToComment);
                }
                this.#createNewComment(this.#nextCommentID,
                    this.#localUser,
                    text,
                    new Date(),
                    replyToComment ? replyToComment.commentID : null, 
                    replyToComment ? replyToComment.author : null);
            }
        );
    }

    #generateDummyComments(): void {
        this.#users.push(new User(0, "LocalUser"));
        this.#localUser = this.#users[0];
        this.#users.push(new User(1, "Алексей_1994b"));
        this.#users.push(new User(2, "Джунбокс3000"));

        const userInfos: string[] = this.#users.map(
            item => JSON.stringify(item.getUserInfo()));
        localStorage.setItem("users", JSON.stringify(userInfos));

        const newComment1 = this.#createNewComment(0,
            this.#users[1],
            String.raw`Самое обидное когда сценарий по сути есть - в виде книг, где нет сюжетных дыр, всё логично, стройное повествование и достаточно взять и экранизировать оригинал как это было в первых фильмах с минимальным количеством отсебятины и зритель с восторгом примет любой такой фильм и сериал, однако вместо этого 'Кольца власти' просто позаимствовали имена из оригинала, куски истории, мало связанные между собой и выдали очередной среднячковый сериал на один раз в лучшем случае.`,
            new Date(2023, 0, 15, 13, 55),
            null, null,
            6,
            false,
            1,
            1);
        this.#createNewComment(1,
            this.#users[2],
            String.raw`Наверное, самая большая ошибка создателей сериала была в том, что они поставили уж слишком много надежд на поддержку фанатов вселенной. Как оказалось на деле, большинство 'фанатов' с самой настоящей яростью и желчью стали уничтожать сериал, при этом объективности в отзывах самый минимум.`,
            new Date(2023, 0, 15, 15, 18),
            newComment1.commentID,
            newComment1.author,
            3,
            false,
            1,
            0);
    }

    #createNewComment(commentID: number | null,
            author: User,
            text: string,
            date: Date,
            replyToID: number | null = null,
            replyToUser: User | null = null,
            rating: number = 0,
            isFavorite: boolean = false,
            ratingLocalUser: number = 0,
            replies: number = 0): UserComment {

        let newComment = new UserComment(
            commentID === null ? this.#nextCommentID : commentID,
            author,
            text,
            date,
            replyToID,
            replyToUser,
            rating,
            isFavorite,
            ratingLocalUser,
            replies,
            (newRating: number) => {
                this.sort(this.#sortType, 
                    this.#sortFromLowestToHighest);
                this.#saveCommentToLocalStorage(newComment);
            },
            (replyToComment: UserComment) => {
                this.#createCommentComponent.setReplyTo(
                    replyToComment);
            },
            () => {
                this.sort(this.#sortType,
                    this.#sortFromLowestToHighest);
                this.#saveCommentToLocalStorage(newComment);
            }
        );
        this.addComment(newComment);
        this.sort(this.#sortType, 
            this.#sortFromLowestToHighest);
        this.#nextCommentID++;
        this.#numberOfCommentsElement.innerHTML
            = `(${this.getNumberOfComments()})`;
        this.#saveCommentToLocalStorage(newComment);
        return newComment;
    }

    #saveCommentToLocalStorage(comment: UserComment): void {
        const info = comment.getCommentInfo();
        localStorage.setItem(`${this.#commentStorePrefix}${comment.commentID}`, 
                JSON.stringify(info));
    }

    #loadFromLocalStorage() {
        const users = localStorage.getItem("users");
        if (users !== undefined) {
            const usersArr: string[] = JSON.parse(users);
            usersArr.forEach(item => {
                const user: User = new User();
                const info: UserInfo = JSON.parse(item);
                user.loadFromUserInfo(info);
                this.#users.push(user);
            });
            this.#localUser = this.#users[0];
        }

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key.startsWith(this.#commentStorePrefix)) {
                const commentInfo: UserCommentInfo = JSON.parse(localStorage.getItem(key));
                this.#nextCommentID = Math.max(commentInfo.commentID, 
                                        this.#nextCommentID);
                this.#createNewComment(
                    commentInfo.commentID, 
                    this.#users[commentInfo.authorID], 
                    commentInfo.text, 
                    new Date(commentInfo.date),
                    commentInfo.replyToID,
                    this.#users[commentInfo.replyToUserID],
                    commentInfo.rating,
                    commentInfo.isFavorite,
                    commentInfo.ratingLocalUser,
                    commentInfo.replies);
            }
        }
        this.#nextCommentID++;
    }
};