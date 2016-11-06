/**
 * Created by kk on 2016/11/7.
 */
import React, {Component} from 'react';
import Immutable from "immutable"
import Rx from "rx-lite"
class Editor extends Component{
  constructor(){
    super();
    this.state={
      val:""
    }
  }
  onAdd(){
    const content=this.state.val;
    this.props.onAdd(content);
    this.setState({val:""});
  }
  onChange(val){
    this.setState({val});
  }
  componentDidMount(){
    let btnAdd=document.getElementById("btn-add");
    let contentInput=document.getElementById("content-input");

    const clickAdd=Rx.Observable.fromEvent(btnAdd,"click");
    const keydown=Rx.Observable.fromEvent(contentInput,"keydown");
    const change=Rx.Observable.fromEvent(contentInput,"input");
    const KeyPressEnter=keydown.filter((e)=>{return e.keyCode==13});
    //add item   Eneter or  clickAdd fired
    KeyPressEnter.merge(clickAdd).subscribe(this.onAdd.bind(this));
    //save value of content-input when type in  input
    change.map((e)=>{
      return e.target.value;
    }).subscribe(this.onChange.bind(this));
  }
  render(){
    return (<div>
      <input value={this.state.val} id="content-input"/><button id="btn-add">add</button>
    </div>)
  }
}
class ListContainer extends Component{
  render(){
    const {store,toggleClick}=this.props;
    return (<ul>
      {
        store.map((item,i)=>{
          const {status,value}=item;
          return <li key={i} onClick={()=>toggleClick(i,status)} className={status?"finished":"no-finish"}>
            {i+1}.<span className={status?"content-finished":"content-no-finish"}>{value}</span>
          </li>
        })
      }
    </ul>)
  }
}
export default class App extends Component{
  constructor(){
    super();
    this.state={
      store:Immutable.List([])
    }
  }
  componentWillMount(){
    Rx.Observable.create((observer)=>{
      this.onAdd=(value)=>{
        const _store=this.state.store.push({status :false,value})
        observer.next(_store)
      }
      this.onToggleClick=(index,status)=>{
        const _store=this.state.store.map((item,_index)=>{
          if (index==_index){
            item.status=!status
          }
          return item
        })
        observer.next(_store)
      }
    }).subscribe((store)=>{
      this.setState({store});
    })
  }
  render(){
    return <div className="container">
      <Editor onAdd={this.onAdd}></Editor>
      <ListContainer store={this.state.store} toggleClick={this.onToggleClick}></ListContainer>
    </div>
  }
}
