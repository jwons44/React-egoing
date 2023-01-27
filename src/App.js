import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Header(props) {
  return <header>
      <h1><a href='/' onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode();
      }}>{[props.title]}</a></h1>
    </header>
}

function Nav(props){
   const lis = [   ]
   for(let i=0; i<props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
   }
  return <nav>
      <ol>
        {lis}
      </ol>
    </nav>
}
function Article(props) {
  return <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
}

function Create(props) {
  return <article>
    <h2>Create</h2> 
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" /></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return <article>
    <h2>Update</h2> 
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        console.log(event.target.value);
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name='body' placeholder='body' value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}

function App() {
  // const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];

  const [mode, setMode] = useState('WELCOME');
  
  // console.log('_mode', _mode);
  
  //li클릭시에 state로 변경하기 위해 id,setId 변수선언, 현재 값이 선택되지 않았기 때문에 null
  const [id, setId] = useState(null);

  const[nextId, setNextId] = useState(4);

  const [topics, setTopics] = useState([
    {id:1, title: 'html', body:'html is...'},
    {id:2, title: 'css', body:'css is...'},
    {id:3, title: 'jsvascript', body:'jsvascript is...'},
  ]);

  let content = null;

  let contextControl = null;

  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
    const value = [1];
    console.log('value :' + value);

    value.push(2);
    console.log('value : ' + value);
  } else if(mode === 'READ') {
    let title, body = null; //title,body 초기화
    //반복문 이용해서 선택한 id(state)와 일치하는 li의 id를 찾아서 그 값을 얻어옴
    for(let i=0; i<topics.length; i++) {
      console.log(topics[i].id, id);
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
    <li><a href={'/update/' + id} onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
    <li><input type="button" value="Delete" onClick={()=>{
      const newTopics = []
      for(let i=0; i<topics.length; i++){
        if(topics[i].id !== id){
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode('WELECOME');
    }}></input></li>
    </>
  }  else if(mode === 'CREATE') {
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title: _title, body:_body}
      const newTopics = [...topics] //복제본
      newTopics.push(newTopic); //복제본에 푸쉬
      setTopics(newTopics); //topics에 추가
      //새 li추가 후 mode를 READ로 변경하여 상세보기로 이동
      setMode('READ');
      //현재글을 nextId로 지정
      setId(nextId);
      //다음 글추가할때를 위해 현재 id+1
      setNextId(nextId+1);
    }}></Create>
  } else if(mode === 'UPDATE') {
    let title, body = null;
    for(let i=0; i<topics.length; i++) {
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++) {
        if(newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
      <div>
        <Header title="REACT" onChangeMode={()=>{
          // alert('Header');
          // mode = 'WELCOME' 값을 바꿀때는 setMode를 사용한다.
          setMode('WELCOME');
        }}></Header>
        <Nav topics={topics} onChangeMode={(_id)=>{
          // alert(id);
          // mode = 'READ' 
          setMode('READ');
          //onChangeMode 매개변수로 _id를 받고 setId를 통해 id를 변경
          setId(_id);
        }}></Nav>
        {content}
        <ul>
          <li>
            <a href='/create' onClick={event=>{
              event.preventDefault();
              setMode('CREATE');
            }}>Create</a>
          </li>
        {contextControl}
        </ul>
      </div>
  );
}

export default App;
