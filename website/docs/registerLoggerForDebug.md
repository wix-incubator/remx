---
id: registerLoggerForDebug
title: registerLoggerForDebug
sidebar_label: registerLoggerForDebug
slug: /api/registerLoggerForDebug
---

### `remx.registerLoggerForDebug(loggerFunc)`
Takes a logger and calls it on the following actions:


```javascript
import {registerLoggerForDebug} from 'remx';
registerLoggerForDebug(console.log); //will log all remx actions:
//on setter call: {action: "setter", name: "someSetterName", args: ["arg1", "arg2"])}
//on getter call: {action: "getter", name: "someGetterName", args: ["arg1", "arg2"])}
//on mapsStateToProps: 
/*   
     {
      "action":"mapStateToProps",
      "connectedComponentName":"SomeComponent",
      "returnValue":{},
      "triggeredEvents":[] // an arry of actions that have been triggered during the run of mapStateToProps
      } 
*/   

//on component re-rendered: {action: "componentRender", name: "SomeComponent"}

```
