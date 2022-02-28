var Mt=Object.defineProperty;var bt=(L,b,I)=>b in L?Mt(L,b,{enumerable:!0,configurable:!0,writable:!0,value:I}):L[b]=I;var U=(L,b,I)=>(bt(L,typeof b!="symbol"?b+"":b,I),I);(function(L,b){typeof exports=="object"&&typeof module!="undefined"?b(exports):typeof define=="function"&&define.amd?define(["exports"],b):(L=typeof globalThis!="undefined"?globalThis:L||self,b(L.ggg={}))})(this,function(L){"use strict";var b={Note:"Note",Rest:"Rest",Octave:"Octave",OctaveShift:"OctaveShift",NoteLength:"NoteLength",NoteVelocity:"NoteVelocity",NoteQuantize:"NoteQuantize",Tempo:"Tempo",InfiniteLoop:"InfiniteLoop",LoopBegin:"LoopBegin",LoopExit:"LoopExit",LoopEnd:"LoopEnd"},I={tempo:120,octave:4,length:4,velocity:100,quantize:75,loopCount:2},Me=function(){function t(r,n){for(var i=0;i<n.length;i++){var u=n[i];u.enumerable=u.enumerable||!1,u.configurable=!0,"value"in u&&(u.writable=!0),Object.defineProperty(r,u.key,u)}}return function(r,n,i){return n&&t(r.prototype,n),i&&t(r,i),r}}();function be(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}var Pe=function(){function t(r){be(this,t),this.source=r,this.index=0}return Me(t,[{key:"hasNext",value:function(){return this.index<this.source.length}},{key:"peek",value:function(){return this.source.charAt(this.index)||""}},{key:"next",value:function(){return this.source.charAt(this.index++)||""}},{key:"forward",value:function(){for(;this.hasNext()&&this.match(/\s/);)this.index+=1}},{key:"match",value:function(n){return n instanceof RegExp?n.test(this.peek()):this.peek()===n}},{key:"expect",value:function(n){this.match(n)||this.throwUnexpectedToken(),this.index+=1}},{key:"scan",value:function(n){var i=this.source.substr(this.index),u=null;if(n instanceof RegExp){var c=n.exec(i);c&&c.index===0&&(u=c[0])}else i.substr(0,n.length)===n&&(u=n);return u&&(this.index+=u.length),u}},{key:"throwUnexpectedToken",value:function(){var n=this.peek()||"ILLEGAL";throw new SyntaxError("Unexpected token: "+n)}}]),t}(),xe=Pe,Ne=function(){function t(r,n){for(var i=0;i<n.length;i++){var u=n[i];u.enumerable=u.enumerable||!1,u.configurable=!0,"value"in u&&(u.writable=!0),Object.defineProperty(r,u.key,u)}}return function(r,n,i){return n&&t(r.prototype,n),i&&t(r,i),r}}();function we(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}var x=b,De=xe,Fe={c:0,d:2,e:4,f:5,g:7,a:9,b:11},ke=function(){function t(r){we(this,t),this.scanner=new De(r)}return Ne(t,[{key:"parse",value:function(){var n=this,i=[];return this._readUntil(";",function(){i=i.concat(n.advance())}),i}},{key:"advance",value:function(){switch(this.scanner.peek()){case"c":case"d":case"e":case"f":case"g":case"a":case"b":return this.readNote();case"[":return this.readChord();case"r":return this.readRest();case"o":return this.readOctave();case">":return this.readOctaveShift(1);case"<":return this.readOctaveShift(-1);case"l":return this.readNoteLength();case"q":return this.readNoteQuantize();case"v":return this.readNoteVelocity();case"t":return this.readTempo();case"$":return this.readInfiniteLoop();case"/":return this.readLoop()}this.scanner.throwUnexpectedToken()}},{key:"readNote",value:function(){return{type:x.Note,noteNumbers:[this._readNoteNumber(0)],noteLength:this._readLength()}}},{key:"readChord",value:function(){var n=this;this.scanner.expect("[");var i=[],u=0;return this._readUntil("]",function(){switch(n.scanner.peek()){case"c":case"d":case"e":case"f":case"g":case"a":case"b":i.push(n._readNoteNumber(u));break;case">":n.scanner.next(),u+=12;break;case"<":n.scanner.next(),u-=12;break;default:n.scanner.throwUnexpectedToken()}}),this.scanner.expect("]"),{type:x.Note,noteNumbers:i,noteLength:this._readLength()}}},{key:"readRest",value:function(){return this.scanner.expect("r"),{type:x.Rest,noteLength:this._readLength()}}},{key:"readOctave",value:function(){return this.scanner.expect("o"),{type:x.Octave,value:this._readArgument(/\d+/)}}},{key:"readOctaveShift",value:function(n){return this.scanner.expect(/<|>/),{type:x.OctaveShift,direction:n|0,value:this._readArgument(/\d+/)}}},{key:"readNoteLength",value:function(){return this.scanner.expect("l"),{type:x.NoteLength,noteLength:this._readLength()}}},{key:"readNoteQuantize",value:function(){return this.scanner.expect("q"),{type:x.NoteQuantize,value:this._readArgument(/\d+/)}}},{key:"readNoteVelocity",value:function(){return this.scanner.expect("v"),{type:x.NoteVelocity,value:this._readArgument(/\d+/)}}},{key:"readTempo",value:function(){return this.scanner.expect("t"),{type:x.Tempo,value:this._readArgument(/\d+(\.\d+)?/)}}},{key:"readInfiniteLoop",value:function(){return this.scanner.expect("$"),{type:x.InfiniteLoop}}},{key:"readLoop",value:function(){var n=this;this.scanner.expect("/"),this.scanner.expect(":");var i={type:x.LoopBegin},u={type:x.LoopEnd},c=[];return c=c.concat(i),this._readUntil(/[|:]/,function(){c=c.concat(n.advance())}),c=c.concat(this._readLoopExit()),this.scanner.expect(":"),this.scanner.expect("/"),i.value=this._readArgument(/\d+/)||null,c=c.concat(u),c}},{key:"_readUntil",value:function(n,i){for(;this.scanner.hasNext()&&(this.scanner.forward(),!(!this.scanner.hasNext()||this.scanner.match(n)));)i()}},{key:"_readArgument",value:function(n){var i=this.scanner.scan(n);return i!==null?+i:null}},{key:"_readNoteNumber",value:function(n){var i=Fe[this.scanner.next()];return i+this._readAccidental()+n}},{key:"_readAccidental",value:function(){return this.scanner.match("+")?1*this.scanner.scan(/\++/).length:this.scanner.match("-")?-1*this.scanner.scan(/\-+/).length:0}},{key:"_readDot",value:function(){for(var n=(this.scanner.scan(/\.+/)||"").length,i=new Array(n),u=0;u<n;u++)i[u]=0;return i}},{key:"_readLength",value:function(){var n=[];n=n.concat(this._readArgument(/\d+/)),n=n.concat(this._readDot());var i=this._readTie();return i&&(n=n.concat(i)),n}},{key:"_readTie",value:function(){return this.scanner.forward(),this.scanner.match("^")?(this.scanner.next(),this._readLength()):null}},{key:"_readLoopExit",value:function(){var n=this,i=[];if(this.scanner.match("|")){this.scanner.next();var u={type:x.LoopExit};i=i.concat(u),this._readUntil(":",function(){i=i.concat(n.advance())})}return i}}]),t}(),Te=ke,Ie=function(){function t(r,n){for(var i=0;i<n.length;i++){var u=n[i];u.enumerable=u.enumerable||!1,u.configurable=!0,"value"in u&&(u.writable=!0),Object.defineProperty(r,u.key,u)}}return function(r,n,i){return n&&t(r.prototype,n),i&&t(r,i),r}}();function qe(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}var P=b,w=I,Ee=Te,Ce=typeof Symbol!="undefined"?Symbol.iterator:"@@iterator",Be=function(){function t(r){qe(this,t),this.source=r,this._commands=new Ee(r).parse(),this._commandIndex=0,this._processedTime=0,this._iterator=null,this._octave=w.octave,this._noteLength=[w.length],this._velocity=w.velocity,this._quantize=w.quantize,this._tempo=w.tempo,this._infiniteLoopIndex=-1,this._loopStack=[],this._done=!1}return Ie(t,[{key:"hasNext",value:function(){return this._commandIndex<this._commands.length}},{key:"next",value:function(){if(this._done)return{done:!0,value:null};if(this._iterator){var n=this._iterator.next();if(!n.done)return n}var i=this._forward(!0);if(se(i))this._iterator=this[i.type](i);else return this._done=!0,{done:!1,value:{type:"end",time:this._processedTime}};return this.next()}},{key:Ce,value:function(){return this}},{key:"_forward",value:function(n){for(;this.hasNext()&&!se(this._commands[this._commandIndex]);){var i=this._commands[this._commandIndex++];this[i.type](i)}return n&&!this.hasNext()&&this._infiniteLoopIndex!==-1?(this._commandIndex=this._infiniteLoopIndex,this._forward(!1)):this._commands[this._commandIndex++]||{}}},{key:"_calcDuration",value:function(n){var i=this;n[0]===null&&(n=this._noteLength.concat(n.slice(1)));var u=null,c=0;return n=n.map(function(p){switch(p){case null:p=u;break;case 0:p=c*=2;break;default:u=c=p;break}var m=p!==null?p:w.length;return 60/i._tempo*(4/m)}),n.reduce(function(p,m){return p+m},0)}},{key:"_calcNoteNumber",value:function(n){return n+this._octave*12+12}},{key:P.Note,value:function(n){var i=this,u="note",c=this._processedTime,p=this._calcDuration(n.noteLength),m=n.noteNumbers.map(function(T){return i._calcNoteNumber(T)}),y=this._quantize,g=this._velocity;return this._processedTime=this._processedTime+p,He(m.map(function(T){return{type:u,time:c,duration:p,noteNumber:T,velocity:g,quantize:y}}))}},{key:P.Rest,value:function(n){var i=this._calcDuration(n.noteLength);this._processedTime=this._processedTime+i}},{key:P.Octave,value:function(n){this._octave=n.value!==null?n.value:w.octave}},{key:P.OctaveShift,value:function(n){var i=n.value!==null?n.value:1;this._octave+=i*n.direction}},{key:P.NoteLength,value:function(n){var i=n.noteLength.map(function(u){return u!==null?u:w.length});this._noteLength=i}},{key:P.NoteVelocity,value:function(n){this._velocity=n.value!==null?n.value:w.velocity}},{key:P.NoteQuantize,value:function(n){this._quantize=n.value!==null?n.value:w.quantize}},{key:P.Tempo,value:function(n){this._tempo=n.value!==null?n.value:w.tempo}},{key:P.InfiniteLoop,value:function(){this._infiniteLoopIndex=this._commandIndex}},{key:P.LoopBegin,value:function(n){var i=n.value!==null?n.value:w.loopCount,u=this._commandIndex,c=-1;this._loopStack.push({loopCount:i,loopTopIndex:u,loopOutIndex:c})}},{key:P.LoopExit,value:function(){var n=this._loopStack[this._loopStack.length-1],i=this._commandIndex;n.loopCount<=1&&n.loopOutIndex!==-1&&(i=n.loopOutIndex),this._commandIndex=i}},{key:P.LoopEnd,value:function(){var n=this._loopStack[this._loopStack.length-1],i=this._commandIndex;n.loopOutIndex===-1&&(n.loopOutIndex=this._commandIndex),n.loopCount-=1,0<n.loopCount?i=n.loopTopIndex:this._loopStack.pop(),this._commandIndex=i}}]),t}();function He(t){var r=0;return{next:function(){return r<t.length?{done:!1,value:t[r++]}:{done:!0}}}}function se(t){return t.type===P.Note||t.type===P.Rest}var Re=Be,le=Re;let k,ce,Y,fe,he=!1;function Ve(t=void 0){k=t==null?new(window.AudioContext||window.webkitAudioContext):t,de(),pe()}function Oe(){he||(he=!0,Ge())}function de(t=150){ce=t,Y=60/ce}function pe(t=8){fe=4/t}function Z(t){const r=Y*fe;return r>0?Math.ceil(t/r)*r:t}function Ge(){const t=k.createBufferSource();t.start=t.start||t.noteOn,t.start()}var V={};(function(t){var r=+Math.PI*2,n=16|0,i=1|0,u=Math.sin,c=Math.pow,p=Math.abs,m=1e-6,y=window.AudioContext||window.webkitAudioContext;t.SampleRate=0|0,t.Sec=0|0,t.SetSampleRate=function(e){t.SampleRate=e|0,t.Sec=e|0},t.SetSampleRate(mt()),t.Live=function(){var e={};return e._generate=function(a){var o=new q(a,t.DefaultModules),l=z(o.getSamplesLeft());return o.generate(l),l},e},t.Module={},t.G={};var g=t.stage={PhaseSpeed:0,PhaseSpeedMod:10,Generator:20,SampleMod:30,Volume:40};function T(e,a){return e.stage-a.stage}t.InitDefaultParams=O;function O(e,a){for(var o=0;o<a.length;o+=1){var l=a[o],f=e[l.name]||{};X(l.params,function(h,d){typeof f[d]=="undefined"&&(f[d]=h.D)}),e[l.name]=f}}t.Processor=q;function q(e,a){e=e||{},a=a||t.DefaultModules,typeof e=="function"?e=e():e=JSON.parse(JSON.stringify(e)),this.finished=!1,this.state={SampleRate:e.SampleRate||t.SampleRate},a=a.slice(),a.sort(T),this.modules=a,O(e,a);for(var o=0;o<this.modules.length;o+=1){var l=this.modules[o];this.modules[o].setup(this.state,e[l.name])}}q.prototype={generate:function(e){for(var a=0|0;a<e.length;a+=1)e[a]=0;if(!this.finished){for(var o=this.state,l=e.length|0,a=0;a<this.modules.length;a+=1){var f=this.modules[a],h=f.process(o,e.subarray(0,l))|0;l=Math.min(l,h)}l<e.length&&(this.finished=!0);for(var a=l;a<e.length;a++)e[a]=0}},getSamplesLeft:function(){for(var e=0,a=0;a<this.state.envelopes.length;a+=1)e+=this.state.envelopes[a].N;return e===0&&(e=3*this.state.SampleRate),e}},t.Module.Frequency={name:"Frequency",params:{Start:{L:30,H:1800,D:440},Min:{L:30,H:1800,D:30},Max:{L:30,H:1800,D:1800},Slide:{L:-1,H:1,D:0},DeltaSlide:{L:-1,H:1,D:0},RepeatSpeed:{L:0,H:3,D:0},ChangeAmount:{L:-12,H:12,D:0},ChangeSpeed:{L:0,H:1,D:0}},stage:g.PhaseSpeed,setup:function(e,a){var o=e.SampleRate;e.phaseParams=a,e.phaseSpeed=a.Start*r/o,e.phaseSpeedMax=a.Max*r/o,e.phaseSpeedMin=a.Min*r/o,e.phaseSpeedMin=Math.min(e.phaseSpeedMin,e.phaseSpeed),e.phaseSpeedMax=Math.max(e.phaseSpeedMax,e.phaseSpeed),e.phaseSlide=1+c(a.Slide,3)*64/o,e.phaseDeltaSlide=c(a.DeltaSlide,3)/(o*1e3),e.repeatTime=0,e.repeatLimit=1/0,a.RepeatSpeed>0&&(e.repeatLimit=a.RepeatSpeed*o),e.arpeggiatorTime=0,e.arpeggiatorLimit=a.ChangeSpeed*o,a.ChangeAmount==0&&(e.arpeggiatorLimit=1/0),e.arpeggiatorMod=1+a.ChangeAmount/12},process:function(e,a){for(var o=+e.phaseSpeed,l=+e.phaseSpeedMin,f=+e.phaseSpeedMax,h=+e.phaseSlide,d=+e.phaseDeltaSlide,S=e.repeatTime,v=e.repeatLimit,_=e.arpeggiatorTime,A=e.arpeggiatorLimit,N=e.arpeggiatorMod,M=0;M<a.length;M++){if(h+=d,o*=h,o=o<l?l:o>f?f:o,S>v)return this.setup(e,e.phaseParams),M+this.process(e,a.subarray(M))-1;S++,_>A&&(o*=N,_=0,A=1/0),_++,a[M]+=o}return e.repeatTime=S,e.arpeggiatorTime=_,e.arpeggiatorLimit=A,e.phaseSpeed=o,e.phaseSlide=h,a.length}},t.Module.Vibrato={name:"Vibrato",params:{Depth:{L:0,H:1,D:0},DepthSlide:{L:-1,H:1,D:0},Frequency:{L:.01,H:48,D:0},FrequencySlide:{L:-1,H:1,D:0}},stage:g.PhaseSpeedMod,setup:function(e,a){var o=e.SampleRate;e.vibratoPhase=0,e.vibratoDepth=a.Depth,e.vibratoPhaseSpeed=a.Frequency*r/o,e.vibratoPhaseSpeedSlide=1+c(a.FrequencySlide,3)*3/o,e.vibratoDepthSlide=a.DepthSlide/o},process:function(e,a){var o=+e.vibratoPhase,l=+e.vibratoDepth,f=+e.vibratoPhaseSpeed,h=+e.vibratoPhaseSpeedSlide,d=+e.vibratoDepthSlide;if(l==0&&d<=0)return a.length;for(var S=0;S<a.length;S++)o+=f,o>r&&(o-=r),a[S]+=a[S]*u(o)*l,f*=h,l+=d,l=yt(l);return e.vibratoPhase=o,e.vibratoDepth=l,e.vibratoPhaseSpeed=f,a.length}},t.Module.Generator={name:"Generator",params:{Func:{C:t.G,D:"square"},A:{L:0,H:1,D:0},B:{L:0,H:1,D:0},ASlide:{L:-1,H:1,D:0},BSlide:{L:-1,H:1,D:0}},stage:g.Generator,setup:function(e,a){e.generatorPhase=0,typeof a.Func=="string"?e.generator=t.G[a.Func]:e.generator=a.Func,typeof e.generator=="object"&&(e.generator=e.generator.create()),W(typeof e.generator=="function","generator must be a function"),e.generatorA=a.A,e.generatorASlide=a.ASlide,e.generatorB=a.B,e.generatorBSlide=a.BSlide},process:function(e,a){return e.generator(e,a)}};var ge=1<<16;t.Module.Guitar={name:"Guitar",params:{A:{L:0,H:1,D:1},B:{L:0,H:1,D:1},C:{L:0,H:1,D:1}},stage:g.Generator,setup:function(e,a){e.guitarA=a.A,e.guitarB=a.B,e.guitarC=a.C,e.guitarBuffer=z(ge),e.guitarHead=0;for(var o=e.guitarBuffer,l=0;l<o.length;l++)o[l]=R()*2-1},process:function(e,a){for(var o=ge,l=o-1,f=+e.guitarA,h=+e.guitarB,d=+e.guitarC,S=f+h+d,v=e.guitarHead,_=e.guitarBuffer,A=0;A<a.length;A++){var N=r/a[A]|0;N=N>o?o:N;var M=v-N+o&l;_[v]=(_[M-0+o&l]*f+_[M-1+o&l]*h+_[M-2+o&l]*d)/S,a[A]=_[v],v=v+1&l}return e.guitarHead=v,a.length}},t.Module.Filter={name:"Filter",params:{LP:{L:0,H:1,D:1},LPSlide:{L:-1,H:1,D:0},LPResonance:{L:0,H:1,D:0},HP:{L:0,H:1,D:0},HPSlide:{L:-1,H:1,D:0}},stage:g.SampleMod+0,setup:function(e,a){e.FilterEnabled=a.HP>m||a.LP<1-m,e.LPEnabled=a.LP<1-m,e.LP=c(a.LP,3)/10,e.LPSlide=1+a.LPSlide*100/e.SampleRate,e.LPPos=0,e.LPPosSlide=0,e.LPDamping=5/(1+c(a.LPResonance,2)*20)*(.01+a.LP),e.LPDamping=1-Math.min(e.LPDamping,.8),e.HP=c(a.HP,2)/10,e.HPPos=0,e.HPSlide=1+a.HPSlide*100/e.SampleRate},enabled:function(e){return e.FilterEnabled},process:function(e,a){if(!this.enabled(e))return a.length;for(var o=+e.LP,l=+e.LPPos,f=+e.LPPosSlide,h=+e.LPSlide,d=+e.LPDamping,S=+e.LPEnabled,v=+e.HP,_=+e.HPPos,A=+e.HPSlide,N=0;N<a.length;N++){(v>m||v<-m)&&(v*=A,v=v<m?m:v>.1?.1:v);var M=l;o*=h,o=o<0?o=0:o>.1?.1:o;var C=a[N];S?(f+=(C-l)*o,f*=d):(l=C,f=0),l+=f,_+=l-M,_*=1-v,a[N]=_}return e.LPPos=l,e.LPPosSlide=f,e.LP=o,e.HP=v,e.HPPos=_,a.length}};var oe=1<<10;t.Module.Phaser={name:"Phaser",params:{Offset:{L:-1,H:1,D:0},Sweep:{L:-1,H:1,D:0}},stage:g.SampleMod+1,setup:function(e,a){e.phaserBuffer=z(oe),e.phaserPos=0,e.phaserOffset=c(a.Offset,2)*(oe-4),e.phaserOffsetSlide=c(a.Sweep,3)*4e3/e.SampleRate},enabled:function(e){return p(e.phaserOffsetSlide)>m||p(e.phaserOffset)>m},process:function(e,a){if(!this.enabled(e))return a.length;for(var o=oe,l=o-1,f=e.phaserBuffer,h=e.phaserPos|0,d=+e.phaserOffset,S=+e.phaserOffsetSlide,v=0;v<a.length;v++){d+=S,d<0&&(d=-d,S=-S),d>l&&(d=l,S=0),f[h]=a[v];var _=h-(d|0)+o&l;a[v]+=f[_],h=h+1&l|0}return e.phaserPos=h,e.phaserOffset=d,a.length}},t.Module.Volume={name:"Volume",params:{Master:{L:0,H:1,D:.5},Attack:{L:.001,H:1,D:.01},Sustain:{L:0,H:2,D:.3},Punch:{L:0,H:3,D:1},Decay:{L:.001,H:2,D:1}},stage:g.Volume,setup:function(e,a){var o=e.SampleRate,l=a.Master,f=l*(1+a.Punch);e.envelopes=[{S:0,E:l,N:a.Attack*o|0},{S:f,E:l,N:a.Sustain*o|0},{S:l,E:0,N:a.Decay*o|0}];for(var h=0;h<e.envelopes.length;h+=1){var d=e.envelopes[h];d.G=(d.E-d.S)/d.N}},process:function(e,a){for(var o=0;e.envelopes.length>0&&o<a.length;){for(var l=e.envelopes[0],f=l.S,h=l.G,d=Math.min(a.length-o,l.N)|0,S=o+d|0;o<S;o+=1)a[o]*=f,f+=h,f=St(f,0,10);l.S=f,l.N-=d,l.N<=0&&e.envelopes.shift()}return o}},t.DefaultModules=[t.Module.Frequency,t.Module.Vibrato,t.Module.Generator,t.Module.Filter,t.Module.Phaser,t.Module.Volume],t.DefaultModules.sort(T),t.EmptyParams=D;function D(){return X(t.Module,function(){return{}})}t._RemoveEmptyParams=F;function F(e){for(var a in e)_e(e[a]).length==0&&delete e[a]}t.Preset={Reset:function(){return D()},Coin:function(){var e=D();return e.Frequency.Start=s(880,660),e.Volume.Sustain=s(.1),e.Volume.Decay=s(.4,.1),e.Volume.Punch=s(.3,.3),s()<.5&&(e.Frequency.ChangeSpeed=s(.15,.1),e.Frequency.ChangeAmount=s(8,4)),F(e),e},Laser:function(){var e=D();return e.Generator.Func=G(["square","saw","sine"]),s()<.33?(e.Frequency.Start=s(880,440),e.Frequency.Min=s(.1),e.Frequency.Slide=s(.3,-.8)):(e.Frequency.Start=s(1200,440),e.Frequency.Min=e.Frequency.Start-s(880,440),e.Frequency.Min<110&&(e.Frequency.Min=110),e.Frequency.Slide=s(.3,-1)),s()<.5?(e.Generator.A=s(.5),e.Generator.ASlide=s(.2)):(e.Generator.A=s(.5,.4),e.Generator.ASlide=s(.7)),e.Volume.Sustain=s(.2,.1),e.Volume.Decay=s(.4),s()<.5&&(e.Volume.Punch=s(.3)),s()<.33&&(e.Phaser.Offset=s(.2),e.Phaser.Sweep=s(.2)),s()<.5&&(e.Filter.HP=s(.3)),F(e),e},Explosion:function(){var e=D();return e.Generator.Func="noise",s()<.5?(e.Frequency.Start=s(440,40),e.Frequency.Slide=s(.4,-.1)):(e.Frequency.Start=s(1600,220),e.Frequency.Slide=s(-.2,-.2)),s()<.2&&(e.Frequency.Slide=0),s()<.3&&(e.Frequency.RepeatSpeed=s(.5,.3)),e.Volume.Sustain=s(.3,.1),e.Volume.Decay=s(.5),e.Volume.Punch=s(.6,.2),s()<.5&&(e.Phaser.Offset=s(.9,-.3),e.Phaser.Sweep=s(-.3)),s()<.33&&(e.Frequency.ChangeSpeed=s(.3,.6),e.Frequency.ChangeAmount=s(24,-12)),F(e),e},Powerup:function(){var e=D();return s()<.5?e.Generator.Func="saw":e.Generator.A=s(.6),e.Frequency.Start=s(220,440),s()<.5?(e.Frequency.Slide=s(.5,.2),e.Frequency.RepeatSpeed=s(.4,.4)):(e.Frequency.Slide=s(.2,.05),s()<.5&&(e.Vibrato.Depth=s(.6,.1),e.Vibrato.Frequency=s(30,10))),e.Volume.Sustain=s(.4),e.Volume.Decay=s(.4,.1),F(e),e},Hit:function(){var e=D();return e.Generator.Func=G(["square","saw","noise"]),e.Generator.A=s(.6),e.Generator.ASlide=s(1,-.5),e.Frequency.Start=s(880,220),e.Frequency.Slide=-s(.4,.3),e.Volume.Sustain=s(.1),e.Volume.Decay=s(.2,.1),s()<.5&&(e.Filter.HP=s(.3)),F(e),e},Jump:function(){var e=D();return e.Generator.Func="square",e.Generator.A=s(.6),e.Frequency.Start=s(330,330),e.Frequency.Slide=s(.4,.2),e.Volume.Sustain=s(.3,.1),e.Volume.Decay=s(.2,.1),s()<.5&&(e.Filter.HP=s(.3)),s()<.3&&(e.Filter.LP=s(-.6,1)),F(e),e},Select:function(){var e=D();return e.Generator.Func=G(["square","saw"]),e.Generator.A=s(.6),e.Frequency.Start=s(660,220),e.Volume.Sustain=s(.1,.1),e.Volume.Decay=s(.2),e.Filter.HP=.2,F(e),e},Lucky:function(){var e=D();return X(e,function(a,o){var l=t.Module[o].params;X(l,function(f,h){if(f.C){var d=_e(f.C);a[h]=d[d.length*R()|0]}else a[h]=R()*(f.H-f.L)+f.L})}),e.Volume.Master=.4,e.Filter={},F(e),e},Synth:function(){var e=D();return e.Generator.Func=G(["square","saw"]),e.Frequency.Start=G([340,240,170]),e.Volume.Attack=s()>.6?s(.5):0,e.Volume.Sustain=s(1),e.Volume.Punch=s(1),e.Volume.Decay=s(.9)+.1,e.Generator.A=s(1),s()<.25&&(e.Filter.HP=s(1)),s()<.25&&(e.Filter.LP=s(1)),F(e),e},Tone:function(){var e=D();return e.Generator.Func="square",e.Frequency.Start=261.6,e.Volume.Sustain=.6441,F(e),e},Click:function(){var e=s()>.5?t.Preset.Hit():t.Preset.Explosion();return s()<.5&&(e.Frequency.Slide=-.5+s(1)),s()<.5&&(e.Volume.Sustain*=s(.4)+.2,e.Volume.Decay*=s(.4)+.2),e.Frequency.Start=s(1200,440),F(e),e}},t.G.unoise=E("sample = Math.random();"),t.G.sine=E("sample = Math.sin(phase);"),t.G.saw=E("sample = 2*(phase/TAU - ((phase/TAU + 0.5)|0));"),t.G.triangle=E("sample = Math.abs(4 * ((phase/TAU - 0.25)%1) - 2) - 1;"),t.G.square=E("var s = Math.sin(phase); sample = s > A ? 1.0 : s < A ? -1.0 : A;"),t.G.synth=E("sample = Math.sin(phase) + .5*Math.sin(phase/2) + .3*Math.sin(phase/4);"),t.G.noise=E("if(phase % TAU < 4){__noiseLast = Math.random() * 2 - 1;} sample = __noiseLast;"),t.G.string={create:function(){for(var e=1<<16,a=e-1,o=z(e),l=0;l<o.length;l++)o[l]=R()*2-1;var f=0;return function(h,d){for(var S=Math.PI*2,v=+h.generatorA,_=+h.generatorASlide,A=+h.generatorB,N=+h.generatorBSlide,M=o,C=0;C<d.length;C++){var Lt=d[C],_t=S/Lt|0;v+=_,A+=N,v=v<0?0:v>1?1:v,A=A<0?0:A>1?1:A;var ue=f-_t+e&a,At=(M[ue-0+e&a]*1+M[ue-1+e&a]*v+M[ue-2+e&a]*A)/(1+v+A);M[f]=At,d[C]=M[f],f=f+1&a}return h.generatorA=v,h.generatorB=A,d.length}}};function E(e){return new Function("$","block",`var TAU = Math.PI * 2;
var sample;
var phase = +$.generatorPhase,
	A = +$.generatorA, ASlide = +$.generatorASlide,
	B = +$.generatorB, BSlide = +$.generatorBSlide;

for(var i = 0; i < block.length; i++){
	var phaseSpeed = block[i];
	phase += phaseSpeed;
	if(phase > TAU){ phase -= TAU };
	A += ASlide; B += BSlide;
   A = A < 0 ? 0 : A > 1 ? 1 : A;
   B = B < 0 ? 0 : B > 1 ? 1 : B;
`+e+`	block[i] = sample;
}

$.generatorPhase = phase;
$.generatorA = A;
$.generatorB = B;
return block.length;
`)}t.CreateAudio=pt;function pt(e){typeof Float32Array!="undefined"&&W(e instanceof Float32Array,"data must be an Float32Array");var a=i*n>>3,o=t.SampleRate*a,l=gt(8+36+e.length*2),f=0;function h(S){for(var v=0;v<S.length;v+=1)l[f]=S.charCodeAt(v),f++}function d(S,v){v<=0||(l[f]=S&255,f++,d(S>>8,v-1))}return h("RIFF"),d(36+e.length*2,4),h("WAVEfmt "),d(16,4),d(1,2),d(i,2),d(t.SampleRate,4),d(o,4),d(a,2),d(n,2),h("data"),d(e.length*2,4),Le(l.subarray(f),e),new Audio("data:audio/wav;base64,"+vt(l))}t.DownloadAsFile=function(e){W(e instanceof Audio,"input must be an Audio object"),document.location.href=e.src},t.Util={},t.Util.CopyFToU8=Le;function Le(e,a){W(e.length/2==a.length,"the target buffer must be twice as large as the iinput");for(var o=0,l=0;l<a.length;l++){var f=+a[l],h=f*32767|0;h=h<-32768?-32768:32767<h?32767:h,h+=h<0?65536:0,e[o]=h&255,o++,e[o]=h>>8,o++}}function vt(e){for(var a=32768,o="",l=0;l<e.length;l+=a){var f=Math.min(l+a,e.length);o+=String.fromCharCode.apply(null,e.subarray(l,f))}return btoa(o)}function mt(){return typeof y!="undefined"?new y().sampleRate:44100}function W(e,a){if(!e)throw new Error(a)}function St(e,a,o){return e=+e,a=+a,o=+o,e<a?+a:e>o?+o:+e}function yt(e){return e=+e,e<0?0:e>1?1:+e}function X(e,a){var o={};for(var l in e)e.hasOwnProperty(l)&&(o[l]=a(e[l],l));return o}function s(e,a){var o=R();return e!==void 0&&(o*=e),a!==void 0&&(o+=a),o}function G(e){return e[e.length*R()|0]}function _e(e){var a=[];for(var o in e)a.push(o);return a}t._createFloatArray=z;function z(e){if(typeof Float32Array=="undefined")for(var a=new Array(e),o=0;o<a.length;o++)a[o]=0;return new Float32Array(e)}function gt(e){if(typeof Uint8Array=="undefined")for(var a=new Array(e),o=0;o<a.length;o++)a[o]=0|0;return new Uint8Array(e)}var Ae=Math.random;t.setRandomFunc=function(e){Ae=e};function R(){return Ae()}})(V={});class ve{constructor(r=null){U(this,"x");U(this,"y");U(this,"z");U(this,"w");this.setSeed(r)}get(r=1,n){return n==null&&(n=r,r=0),this.next()/4294967295*(n-r)+r}getInt(r,n){n==null&&(n=r,r=0);const i=Math.floor(r),u=Math.floor(n);return u===i?i:this.next()%(u-i)+i}getPlusOrMinus(){return this.getInt(2)*2-1}select(r){return r[this.getInt(r.length)]}setSeed(r,n=123456789,i=362436069,u=521288629,c=32){this.w=r!=null?r>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=n>>>0,this.y=i>>>0,this.z=u>>>0;for(let p=0;p<c;p++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const r=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(r^r>>>8))>>>0,this.w}}function ze(t,r){let n=[];for(let i=0;i<t;i++)n.push(r(i));return n}const me=["coin","laser","explosion","powerUp","hit","jump","select","random","synth","tone","click"],Ue={coin:"Coin",laser:"Laser",explosion:"Explosion",powerUp:"PowerUp",hit:"Hit",jump:"Jump",select:"Select",random:"Lucky",synth:"Synth",tone:"Tone",click:"Click"},j=new ve;let $,Se;function Qe(){Se=V.Live(),$=[],V.setRandomFunc(()=>j.get())}function Je(t){je(t)}function Ke(){const t=k.currentTime;$.forEach(r=>{$e(r,t)})}function ee(t,r,n=2,i=.05,u=void 0,c=1,p=1){j.setSeed(r);const m=V.Preset[Ue[t!=null?t:me[j.getInt(8)]]],y=ze(n,()=>{const g=m();return u!=null&&g.Frequency.Start!=null&&(g.Frequency.Start=u),g.Volume.Attack!=null&&(g.Volume.Attack*=c),g.Volume.Sustain!=null&&(g.Volume.Sustain*=p),g});return We(t,y,i)}function We(t,r,n){const i=r.map(c=>{const p=Se._generate(c),m=k.createBuffer(1,p.length,V.SampleRate);var y=m.getChannelData(0);return y.set(p),m}),u=k.createGain();return u.gain.value=n,u.connect(k.destination),{type:t,params:r,volume:n,buffers:i,bufferSourceNodes:void 0,gainNode:u,isPlaying:!1,playedTime:void 0}}function Xe(t,r,n,i,u){const c=new ve;c.setSeed(n);let p;if(r){let m=c.select(["hit","hit","click","click","explosion"]);i!=null&&(m=i),p=ee(m,c.getInt(999999999),m==="explosion"?1:2,u!=null?u:m==="explosion"?.04:.05,c.get(100,200),m==="explosion"?.5:1,m==="explosion"?.2:1)}else{const m=Ye(t);let y=c.get()<1/m?"select":c.select(["tone","tone","synth"]);i!=null&&(y=i),p=ee(y,c.getInt(999999999),y!=="select"?1:2,u!=null?u:y==="tone"?.03:y==="synth"?.04:.025,261.6,y!=="select"?.1:1,y!=="select"?2:1)}return p.isDrum=r,p.seed=n,p}function Ye(t){if(t==null||t.notes.length===0)return 1;let r=0,n=0;return t.notes.forEach(i=>{const u=i.quantizedEndStep-i.quantizedStartStep;u>0&&(r+=u,n++)}),r/n}function Ze(t){$.push(t)}function je(t){t.isPlaying=!0}function $e(t,r){if(!t.isPlaying)return;t.isPlaying=!1;const n=Z(r);(t.playedTime==null||n>t.playedTime)&&(te(t,n),t.playedTime=n)}function te(t,r,n=void 0){t.bufferSourceNodes=[],t.buffers.forEach(i=>{const u=k.createBufferSource();if(u.buffer=i,n!=null&&u.playbackRate!=null){const c=Math.pow(2,1/12);u.playbackRate.value=Math.pow(c,n)}u.start=u.start||u.noteOn,u.connect(t.gainNode),u.start(r),t.bufferSourceNodes.push(u)})}function ne(t,r=void 0){t.bufferSourceNodes!=null&&(t.bufferSourceNodes.forEach(n=>{r==null?n.stop():n.stop(r)}),t.bufferSourceNodes=void 0)}const et=1e3;function tt(t){let r=`${t}`,n;me.forEach(T=>{const O=`@${T}`,q=r.indexOf(O);q>=0&&(n=T,r=`${r.slice(0,q)}${r.slice(q+O.length)}`)});const i="@d",u=r.indexOf(i);let c=!1;u>=0&&(c=!0,r=`${r.slice(0,u)}${r.slice(u+i.length)}`);const p=r.match(/@s\d+/);let m=1;p!=null&&(m=Number.parseInt(p[0].substring(2)),r=r.replace(/@s\d+/,""));const y=r.match(/v\d+/);let g;return y!=null&&(g=Number.parseInt(y[0].substring(1))/et,r=r.replace(/v\d+/,"")),{mml:r,args:{isDrum:c,seed:m,type:n,volume:g}}}function nt(t,r,n,i){return{mml:t,sequence:r,soundEffect:n,noteIndex:0,endStep:-1,visualizer:i}}let Q,J,B,re,H,ae=!1;function rt(t,r){Q=t,J=r,B=0,re=Y/2,H=Z(k.currentTime)-re,Q.forEach(n=>{n.noteIndex=0}),ae=!0}function at(){ae=!1,Q.forEach(t=>{ne(t.soundEffect)})}function it(){if(!ae)return;const t=k.currentTime;t<H||(H+=re,H<t&&(H=Z(t)),Q.forEach(r=>{ot(r,H)}),B++,B>=J&&(B=0))}function ot(t,r){const n=t.sequence.notes[t.noteIndex];n!=null&&((t.soundEffect.type==="synth"||t.soundEffect.type==="tone")&&t.endStep===B&&ne(t.soundEffect,r),n.quantizedStartStep===B&&((t.soundEffect.type==="synth"||t.soundEffect.type==="tone")&&ne(t.soundEffect),t.soundEffect.isDrum?te(t.soundEffect,r):te(t.soundEffect,r,n.pitch-69),t.visualizer!=null&&t.visualizer.redraw(n),t.endStep=n.quantizedEndStep,t.endStep>=J&&(t.endStep-=J),t.noteIndex++,t.noteIndex>=t.sequence.notes.length&&(t.noteIndex=0)))}const ie=.125;let ye,K;function ut(t,r=1){let n=0;const i=t.map(c=>tt(c));i.forEach(c=>{const p=ht(c.mml);p>n&&(n=p)});const u=i.map(c=>{const{mml:p,args:m}=c,y=dt(p,n),g=Xe(y,m.isDrum,m.seed,m.type,m.volume*r);return nt(p,y,g)});rt(u,n)}function st(){at()}function lt(t=void 0,r=void 0,n=2,i=1,u=void 0){const c=`${t}_${r}_${n}_${i}_${u}`;if(K[c]==null){const p=ee(t,r==null?ye:r,n,.05*i,u);Ze(p),K[c]=p}Je(K[c])}function ct(){it(),Ke()}function ft(t=1,r=void 0){ye=t,Ve(r),Qe(),K={}}function ht(t){const r=new le(t);for(let n of r)if(n.type==="end")return Math.floor(n.time/ie)}function dt(t,r){const n=[],i=new le(t);for(let u of i)if(u.type==="note"){let c=Math.floor(u.time+u.duration/ie);c>=r&&(c-=r),n.push({pitch:u.noteNumber,quantizedStartStep:Math.floor(u.time/ie),endStep:c})}return{notes:n}}L.init=ft,L.playMml=ut,L.playSoundEffect=lt,L.setQuantize=pe,L.setTempo=de,L.startAudio=Oe,L.stopMml=st,L.update=ct,Object.defineProperty(L,"__esModule",{value:!0}),L[Symbol.toStringTag]="Module"});
