import katex from 'katex';
export function BookFormula({math}:{math:string}) {
  return <div className="book-formula" dangerouslySetInnerHTML={{__html:katex.renderToString(math,{throwOnError:false,strict:false,displayMode:true})}}/>;
}
