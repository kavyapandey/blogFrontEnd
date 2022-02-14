import "./header.css";

export default function Header() {
  return (
    <div className="header container-fluid">
      <div className="headerTitles">
        <span className="headerTitleLg">.Story</span>
      </div>
      <img
        className="headerImg"
        src="../homePage.jpg"
        alt=""
        height="650"
        width="940"
      />
    </div>
  );
}
