
class UserInfo {
    id: number = 0;
    name: string = '';
    avatarPictureLink: string = '';
}

class User {
    readonly #randomAvatarSource = 'https://picsum.photos/';
    readonly #avatarSize = 61;
    id: number = 0;
    name: string = '';
    avatarPictureLink: string = '';

    constructor(id: number = 0, name: string = '') {
        this.id = id;
        this.name = name;
        this.avatarPictureLink = this.#randomAvatarSource 
            + this.#avatarSize + '?random=' + id;
    }

    getUserInfo() {
        const info = new UserInfo();
        info.id = this.id;
        info.name = this.name;
        info.avatarPictureLink = this.avatarPictureLink;
        return info;
    }

    loadFromUserInfo(info: UserInfo) {
        this.id = info.id;
        this.name = info.name;
        this.avatarPictureLink = info.avatarPictureLink;
    } 
};