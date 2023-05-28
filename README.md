Comments component study project. Written in Typescript.
Build: npm run build

Functional requirements:

    1. add comments. Since the project does not imply the creation of a server part, the data can be saved in the browser, and mock data (artificial data that mimics real data) can be used for testing.
    reply to existing comments.
    2. set the maximum comment length (1000 characters). If this limit is exceeded, the user is prohibited from publishing a comment (the button for sending a comment should become inactive).
    3. change the rating of a comment - increase or decrease it by one. Each user can change the rating strictly by one (no more). Data about the rating and its change can also be stored in the browser. You can register this in localStorage, so that after refreshing the page it will be clear that the user has already changed the rating of the comment.
    4. add comment to favorites. After adding a comment to favorites, the icon and text (layout) should change. Pressing again cancels all changes and the comment is no longer selected.
    5. sort all comments by various parameters - favorites, by posting date, number of ratings, number of replies. By default, sort by posting date.



Code Requirements:

    1. The project is made using TypeScript.
    2. OOP is applied on ES6 classes.
    3. The uniformity of code design has been observed: correct indents between semantic blocks, a single format of indents from the left edge (two or four spaces - your choice), and so on.
    4. All variables, classes and functions have meaningful names.
    5. The project follows the principles of DRY (Don't Repeat Yourself) and KISS (Keep It Short and Simple).
    6. All comments are stored in localStorage.
    7. To generate user avatars, third-party services are used, such as Picsum.