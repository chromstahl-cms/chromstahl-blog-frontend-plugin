export const css = `
.blogTextContainer * > img {
    height: 25%;
}

.blogTextContainer {
    line-height: 1.4rem;
    max-width: 50vw;
}

.blogTextContainer > p {
    margin-top: 16px;
    margin-bottom: 16px;
}

.blogTextContainer > p:last-child {
    margin-top: 16px;
    margin-bottom: 0px;
}

.blog-heading {
    margin: 1rem;
    margin-left: 0;
    margin-top: 0;
}


.blogPostContainer {
    margin-top: 2em;
    margin-bottom: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2em;
}

@media (min-width:961px)  {
    .blogTextContainer {
        min-width: 45rem;
    }
}

.blogHeadingContainer {
    display: flex;
    width: 100%;
}

.blogHeadingContainer > p {
    margin-left: auto;
    color: #d1d1d1;
}

.blogTextContainer ul, .blogTextContainer ol {
  padding-left: 30px;
}

.blogTextContainer ul {
    list-style: disc;
}

.blogTextContainer ol {
    list-style: decimal;
}

.blogTextContainer blockquote {
  padding-left: 1em;
  border-left: 3px solid #eee;
  margin-left: 0; margin-right: 0;
}

.blogTextContainer img {
  cursor: default;
}

.blogTextContainer h5 {
  margin: 0;
  font-weight: normal;
  font-size: 100%;
  color: #444;
}

.blogTextContainer hr {
  padding: 2px 10px;
  border: none;
  margin: 1em 0;
}

.blogTextContainer hr:after {
  content: "";
  display: block;
  height: 1px;
  background-color: silver;
  line-height: 2px;
}

.commentSectionDivider {
    margin-top: 2rem;
    margin-bottom: 2rem;
    border-top: 2px solid rgba(0,0,0,.54);
    width: 75px;
}

.commentDivider {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-top: 1px solid rgba(0,0,0,.30);
    width: 50px;
}

.commentHeader {
    display: flex;
    margin-bottom: 1rem;
}

.commentDate {
    margin-left: auto;
    color: #d1d1d1;
}

.commentInput {
    margin-bottom: 2rem;
    height: 2rem;
    padding: 1rem;
}

`
