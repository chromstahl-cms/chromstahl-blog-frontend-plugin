export const css = `
.blogTextContainer * > img {
    height: 25%;
}

.blogTextContainer {
    line-height: 1.4rem;
    max-width: 50vw;
}

.blogTextContainer > * p {
    margin-top: 0.5rem;
}

.blogHeadingContainer > h1,
.blogHeadingContainer > h2,
.blogHeadingContainer > h3,
.blogHeadingContainer > h4,
.blogHeadingContainer > h5,
.blogHeadingContainer > h6 {
    margin: 1rem;
    margin-left: 0;
    margin-top: 0;
}


.blogPostContainer {
    margin-top: 2em;
    margin-bottom: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2em;
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
`
