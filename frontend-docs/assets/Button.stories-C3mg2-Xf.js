import{g as j}from"./index-D4H_InIO.js";import{j as z}from"./jsx-runtime-BO8uF4Og.js";var m={exports:{}},d,g;function F(){if(g)return d;g=1;var t="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return d=t,d}var y,b;function W(){if(b)return y;b=1;var t=F();function o(){}function n(){}return n.resetWarningCache=o,y=function(){function e(I,L,V,D,U,E){if(E!==t){var f=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw f.name="Invariant Violation",f}}e.isRequired=e;function r(){return e}var a={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:r,element:e,elementType:e,instanceOf:r,node:e,objectOf:r,oneOf:r,oneOfType:r,shape:r,exact:r,checkPropTypes:n,resetWarningCache:o};return a.PropTypes=a,a},y}var h;function N(){return h||(h=1,m.exports=W()()),m.exports}var w=N();const s=j(w),l=({primary:t,backgroundColor:o,size:n,label:e,onClick:r})=>{const a=t?"primary-button":"secondary-button";return z.jsx("button",{type:"button",className:["button",`button--${n}`,a].join(" "),style:o&&{backgroundColor:o},onClick:r,children:e})};l.propTypes={primary:s.bool,backgroundColor:s.string,size:s.oneOf(["small","medium","large"]),label:s.string.isRequired,onClick:s.func};l.defaultProps={primary:!1,size:"medium",onClick:void 0};l.__docgenInfo={description:"Basic button component for user interactions",methods:[],displayName:"Button",props:{primary:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},size:{defaultValue:{value:"'medium'",computed:!1},description:"",type:{name:"enum",value:[{value:"'small'",computed:!1},{value:"'medium'",computed:!1},{value:"'large'",computed:!1}]},required:!1},onClick:{defaultValue:{value:"undefined",computed:!0},description:"",type:{name:"func"},required:!1},backgroundColor:{description:"",type:{name:"string"},required:!1},label:{description:"",type:{name:"string"},required:!0}}};const Y={title:"Example/Button",component:l,tags:["autodocs"],argTypes:{backgroundColor:{control:"color"},onClick:{action:"clicked"}}},p={args:{primary:!0,label:"Button"}},i={args:{label:"Button"}},c={args:{size:"large",label:"Button"}},u={args:{size:"small",label:"Button"}};var T,v,S;p.parameters={...p.parameters,docs:{...(T=p.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    primary: true,
    label: 'Button'
  }
}`,...(S=(v=p.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var P,R,_;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    label: 'Button'
  }
}`,...(_=(R=i.parameters)==null?void 0:R.docs)==null?void 0:_.source}}};var B,q,x;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    size: 'large',
    label: 'Button'
  }
}`,...(x=(q=c.parameters)==null?void 0:q.docs)==null?void 0:x.source}}};var k,C,O;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    size: 'small',
    label: 'Button'
  }
}`,...(O=(C=u.parameters)==null?void 0:C.docs)==null?void 0:O.source}}};const $=["Primary","Secondary","Large","Small"];export{c as Large,p as Primary,i as Secondary,u as Small,$ as __namedExportsOrder,Y as default};
