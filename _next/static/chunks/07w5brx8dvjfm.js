(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18566,(t,e,i)=>{e.exports=t.r(76562)},96726,t=>{"use strict";var e=t.i(43476),i=t.i(71645);t.s(["Intro",0,function(){let[t,o]=(0,i.useState)("playing");return((0,i.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void o("done");let t=window.setTimeout(()=>o("opening"),2100),e=()=>o(t=>"playing"===t?"opening":t);return window.addEventListener("keydown",e),()=>{window.clearTimeout(t),window.removeEventListener("keydown",e)}},[]),(0,i.useEffect)(()=>{if("opening"!==t)return;let e=window.setTimeout(()=>o("done"),1500);return()=>window.clearTimeout(e)},[t]),"done"===t)?null:(0,e.jsxs)("div",{className:"intro","data-state":t,"aria-hidden":"true",onPointerDown:()=>o("opening"),children:[(0,e.jsx)("div",{className:"intro__stars"}),(0,e.jsx)("div",{className:"intro__glow"}),(0,e.jsx)("span",{className:"intro__ring intro__ring--1"}),(0,e.jsx)("span",{className:"intro__ring intro__ring--2"}),(0,e.jsx)("span",{className:"intro__ring intro__ring--3"}),(0,e.jsxs)("div",{className:"intro__mark",children:[(0,e.jsx)("img",{src:"/bella-figura-next-preview/brand/emblem-fire.jpg",alt:"",width:752,height:1392,className:"intro__emblem"}),(0,e.jsxs)("p",{className:"intro__name",children:["Bella ",(0,e.jsx)("em",{children:"Figura"})]})]})]})}])},5728,t=>{"use strict";var e=t.i(43476),i=t.i(18566),o=t.i(71645),r=t.i(83301);let s=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,n=`#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uHeat;
uniform float uSuck;
uniform float uWave;
uniform float uSplit;
uniform float uFill;
uniform float uDim;
uniform vec2 uPointer;
uniform float uPull;
uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform vec3 uTexAspect;
uniform vec3 uLoaded;
uniform vec3 uPhoto;
uniform sampler2D uTex3;
uniform float uLogo;
uniform float uLogoAspect;

out vec4 outColor;

const vec3 PEARL = vec3(0.992, 0.962, 0.915);
const vec3 GOLD = vec3(0.800, 0.615, 0.395);
const vec3 EMBER = vec3(0.905, 0.345, 0.165);
const vec3 GLOW = vec3(1.000, 0.760, 0.500);
const vec3 NIGHT = vec3(0.150, 0.052, 0.040);
const float BODY_2 = 0.82;
const float BODY_3 = 0.92;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amp * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    amp *= 0.5;
  }
  return value;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

/* Where the three bodies sit once split (all at the centre when uSplit is 0). */
void bodyOffsets(out vec2 o1, out vec2 o2, out vec2 o3) {
  float R = uRadius;
  float s = uSplit;
  float drift = uTime * 0.25;
  o1 = vec2(-1.05 + 0.06 * sin(drift), 0.38) * R * s;
  o2 = vec2(0.98, 0.52 + 0.06 * cos(drift * 1.3)) * R * s;
  o3 = vec2(0.08, -0.88 + 0.05 * sin(drift * 0.8)) * R * s;
}

float bodyRadius() {
  return uRadius * mix(1.0, 0.6, uSplit);
}

float field(vec2 p) {
  float R = uRadius;
  vec2 q = p - uCenter;

  // Vacuum: draw in a waist and stand taller.
  float waist = uSuck * 0.85 * exp(-pow((q.y - R * 0.08) / (R * 0.36), 2.0));
  q.x *= 1.0 + waist;
  q.y *= 1.0 - uSuck * 0.2;

  // Split into three bodies that stay joined by a soft bridge.
  vec2 o1, o2, o3;
  bodyOffsets(o1, o2, o3);
  float r = bodyRadius();
  float k = R * 0.5 * uSplit + 0.0005;
  float d = length(q - o1) - r;
  d = smin(d, length(q - o2) - r * BODY_2, k);
  d = smin(d, length(q - o3) - r * BODY_3, k);

  // Breathing, organic edge. Calmer while pinched or holding a photo, so the shape reads.
  float calm = 1.0 - 0.6 * uSuck;
  float n = fbm(q / R * 1.25 + vec2(0.0, uTime * 0.11));
  d += (n - 0.5) * R * 0.36 * calm;
  d += sin(atan(q.y, q.x) * 3.0 + uTime * 0.45) * R * 0.028 * calm;

  // Roller: ridges travelling down the body.
  d += uWave * R * 0.042 * sin(q.y / R * 17.0 - uTime * 2.2);

  // Reach toward the pointer when it comes close.
  float near = smoothstep(R * 1.9, R * 0.7, length(uPointer - uCenter));
  float dp = length(p - uPointer) - R * 0.17 * near;
  d = mix(d, smin(d, dp, R * uPull * near + 0.0005), near);

  // Flood the whole screen.
  d -= uFill * 3.2;
  return d;
}

/* A photo seen through the body, cropped to cover a circle of the given radius. */
vec3 lens(sampler2D tex, float aspect, vec2 p, vec2 centre, float radius, vec2 warp) {
  vec2 uv = (p - centre) / (radius * 2.05);
  if (aspect > 1.0) {
    uv.x /= aspect;
  } else {
    uv.y *= aspect;
  }
  return texture(tex, clamp(uv + 0.5 + warp, 0.002, 0.998)).rgb;
}

void main() {
  float unit = min(uRes.x, uRes.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / unit;
  float R = uRadius;
  float rb = bodyRadius();
  float d = field(p);

  // Far from the body there is nothing to draw: stop before the expensive shading.
  if (d > R * 1.9 && uFill < 0.002) {
    outColor = vec4(0.0);
    return;
  }

  vec2 grad = vec2(dFdx(d), dFdy(d));
  vec2 g = grad / max(length(grad), 1e-6);

  float depth = clamp(-d / (rb * 0.85), 0.0, 1.0);
  float z = sqrt(1.0 - pow(1.0 - depth, 2.0));
  vec3 normal = normalize(vec3(g * (1.0 - z) * 1.25, z + 0.16));
  vec3 light = normalize(vec3(-0.45, 0.65, 0.6));
  float diffuse = clamp(dot(normal, light) * 0.5 + 0.5, 0.0, 1.0);
  float glint = max(reflect(-light, normal).z, 0.0);
  float specular = pow(glint, 64.0) * 0.55 + pow(glint, 9.0) * 0.14;

  // Pearl body with champagne in the shade.
  vec3 color = mix(GOLD, PEARL, smoothstep(0.12, 0.92, diffuse));

  // Slow light moving under the surface.
  float inner = fbm((p - uCenter) / R * 2.6 + vec2(uTime * 0.07, uTime * 0.05));
  color *= 0.95 + 0.1 * inner;

  // A second, warm light from below, as if bounced off skin.
  float bounce = clamp(dot(normal, normalize(vec3(0.55, -0.6, 0.35))), 0.0, 1.0);
  color += EMBER * pow(bounce, 2.0) * 0.16 * (1.0 - z * 0.6);

  // Infrared: lit from within.
  float core = smoothstep(0.0, 0.75, depth);
  vec3 heat = mix(EMBER, GLOW, core * 0.75);
  color = mix(color, heat, uHeat * (0.25 + 0.6 * core));

  // The machines, seen through the body. One photo while whole; one per body once split.
  vec2 o1, o2, o3;
  bodyOffsets(o1, o2, o3);
  vec2 c1 = uCenter + o1;
  vec2 c2 = uCenter + o2;
  vec2 c3 = uCenter + o3;
  vec3 nearest = exp(-vec3(length(p - c1), length(p - c2) / BODY_2, length(p - c3) / BODY_3) / (R * 0.1));
  nearest /= nearest.x + nearest.y + nearest.z;
  vec3 weights = mix(uPhoto, nearest, uSplit) * uLoaded;
  float presence = clamp(weights.x + weights.y + weights.z, 0.0, 1.0);

  float ridgePhase = (p.y - uCenter.y) / R * 17.0 - uTime * 2.2;
  vec2 warp = -g * (1.0 - z) * 0.05 + vec2(uWave * 0.005 * sin(ridgePhase), 0.0);
  vec3 photo =
    lens(uTex0, uTexAspect.x, p, c1, rb, warp) * weights.x +
    lens(uTex1, uTexAspect.y, p, c2, rb * mix(1.0, BODY_2, uSplit), warp) * weights.y +
    lens(uTex2, uTexAspect.z, p, c3, rb * mix(1.0, BODY_3, uSplit), warp) * weights.z;
  photo /= max(weights.x + weights.y + weights.z, 1e-4);
  photo = mix(photo, photo * vec3(1.1, 0.93, 0.86), uHeat * 0.45);
  float window = smoothstep(0.08, 0.3, depth) * presence;
  color = mix(color, photo, window);

  // The studio's emblem, set into the pearl in gold.
  if (uLogo > 0.001) {
    vec2 luv = (p - uCenter - vec2(0.04, 0.03) * R) / (rb * 1.12);
    luv.y *= uLogoAspect;
    luv += 0.5;
    float inBox = step(0.0, luv.x) * step(luv.x, 1.0) * step(0.0, luv.y) * step(luv.y, 1.0);
    float mark = texture(uTex3, luv).a * inBox;
    float bevel = mark - texture(uTex3, luv + vec2(0.006, -0.006)).a * inBox;
    vec3 leaf = mix(vec3(0.50, 0.34, 0.16), vec3(0.83, 0.64, 0.37), diffuse);
    float set = mark * uLogo * smoothstep(0.08, 0.3, depth);
    color = mix(color, leaf, set * 0.94);
    color += bevel * 0.2 * uLogo;
  }

  // Roller ridges catch the light.
  color *= 1.0 + uWave * 0.08 * sin(ridgePhase) * depth;

  // Glass on top: rim light, mother-of-pearl sheen, highlights.
  float fresnel = pow(1.0 - z, 2.5);
  color += fresnel * vec3(1.0, 0.86, 0.72) * 0.14;
  vec3 sheen = 0.5 + 0.5 * cos(6.2831 * (fresnel * 1.3 + inner * 0.5 + vec3(0.0, 0.33, 0.67)));
  color += sheen * fresnel * 0.07;
  color += specular;

  // Flooded: a slow, dark ember current.
  float current = fbm(p * 1.4 + vec2(uTime * 0.04, -uTime * 0.03));
  vec3 night = NIGHT * (0.75 + 0.7 * current) + EMBER * 0.1 * pow(current, 3.0);
  color = mix(color, night, smoothstep(0.0, 1.0, uFill));

  float aa = 1.5 / unit;
  float inside = smoothstep(aa, -aa, d);

  // Warm halo, with slow rings when heated.
  float outside = max(d, 0.0);
  float halo = exp(-outside / (R * 0.32)) * (0.1 + 0.42 * uHeat);
  halo += uHeat * 0.09 * (0.5 + 0.5 * sin(outside / R * 24.0 - uTime * 2.2)) * exp(-outside / (R * 0.55));
  vec3 haloColor = mix(GOLD, EMBER, uHeat * 0.85);

  float grain = hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5;
  color += grain * 0.03;

  // Soft shadow cast down and to the right, so the body sits above the page.
  // Only pixels outside the body can be in shadow, so the second field lookup is skipped inside.
  float shadow = 0.0;
  if (inside < 0.999 && uFill < 0.98) {
    float dropped = field(p + vec2(-0.035, 0.05) * (R / 0.35));
    shadow = smoothstep(R * 0.3, -R * 0.1, dropped) * 0.2 * (1.0 - uFill);
  }
  vec3 shadowColor = vec3(0.30, 0.17, 0.10);

  float outer = 1.0 - inside;
  float alpha = inside + (halo + shadow * (1.0 - halo)) * outer;
  vec3 rgb = color * inside + (haloColor * halo + shadowColor * shadow * (1.0 - halo)) * outer;
  outColor = vec4(rgb, alpha) * uDim;
}
`,l=["uRes","uTime","uCenter","uRadius","uHeat","uSuck","uWave","uSplit","uFill","uDim","uPointer","uPull","uTex0","uTex1","uTex2","uTexAspect","uLoaded","uPhoto","uTex3","uLogo","uLogoAspect"];function a(t,e,i){let o=t.createShader(e);if(!o)throw Error("Could not create shader");if(t.shaderSource(o,i),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS))throw Error(t.getShaderInfoLog(o)??"Shader failed to compile");return o}function h(t,e,i,o){let r=t.createTexture();if(t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,r),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([236,222,204,255])),!i)return()=>void 0;let s=!1,n=new Image;return n.decoding="async",n.onload=()=>{s||t.isContextLost()||(t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,r),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,n),t.generateMipmap(t.TEXTURE_2D),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),o(n.naturalWidth/n.naturalHeight))},n.src=i,()=>{s=!0}}function c(){return Array.from(document.querySelectorAll("[data-form]")).flatMap(t=>{let e=t.dataset.form;if(!(0,r.C)(e))return[];let i=t.querySelector("[data-form-anchor]")??t;return[{element:t,anchor:i,state:r.n[e]}]})}function u(t,e,i,o){return t+(e-t)*(1-Math.exp(-i*o))}t.s(["LivingForm",0,function({photos:t}){let d=(0,o.useRef)(null),m=(0,o.useRef)(()=>void 0),p=(0,i.usePathname)(),{infrared:f,vacuum:v,roller:g}=t;return(0,o.useEffect)(()=>{m.current()},[p]),(0,o.useEffect)(()=>{let t,e=d.current,i=e?.getContext("webgl2",{alpha:!0,antialias:!1,powerPreference:"high-performance"}),o=document.documentElement;if(!e||!i)return void o.classList.add("no-webgl");try{t=function(t){let e=t.createProgram();if(t.attachShader(e,a(t,t.VERTEX_SHADER,s)),t.attachShader(e,a(t,t.FRAGMENT_SHADER,n)),t.linkProgram(e),!t.getProgramParameter(e,t.LINK_STATUS))throw Error(t.getProgramInfoLog(e)??"Program failed to link");t.useProgram(e);let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let o=t.getAttribLocation(e,"aPosition");t.enableVertexAttribArray(o),t.vertexAttribPointer(o,2,t.FLOAT,!1,0,0);let r=Object.fromEntries(l.map(i=>[i,t.getUniformLocation(e,i)]));return t.uniform1i(r.uTex0,0),t.uniform1i(r.uTex1,1),t.uniform1i(r.uTex2,2),t.uniform1i(r.uTex3,3),r}(i)}catch(t){console.error("[living-form] shader unavailable:",t),o.classList.add("no-webgl");return}let p=window.matchMedia("(prefers-reduced-motion: reduce)").matches,w=window.matchMedia("(pointer: coarse)").matches?1.25:1.5,S=0,E={infrared:f,vacuum:v,roller:g},y=[1,1,1],T=[0,0,0],R=r.l.map((t,e)=>h(i,e,E[t],t=>{y[e]=t,T[e]=1})),x=1,b=0,L=h(i,3,"/bella-figura-next-preview/brand/emblem.png",t=>{x=t,b=1}),_=c(),M=null,A=null,N=null;m.current=()=>{_=c(),A=null,N=null};let P=0,z=0,C=0,O=performance.now(),D=0,k=-1,F={x:9,y:9,targetX:9,targetY:9},W=()=>{let t=Math.min(window.devicePixelRatio||1,w);P=e.clientWidth||window.innerWidth,z=e.clientHeight||window.innerHeight;let o=Math.round(P*t),r=Math.round(z*t);(e.width!==o||e.height!==r)&&(e.width=o,e.height=r,i.viewport(0,0,o,r)),_=c()},H=t=>{if("mouse"!==t.pointerType)return;let e=Math.min(P,z);F.targetX=(t.clientX-P/2)/e,F.targetY=-(t.clientY-z/2)/e},I=t=>{let e=t.target?.closest?.("[data-form-show]");A=e?r.u[e.dataset.formShow??""]??null:null},B=()=>{A=null},U=t=>{let e=t.detail;N=e?r.u[e]??null:null},X=s=>{var n,l;C=requestAnimationFrame(X);let a=s-O,h=Math.min(a/1e3,.05);if(O=s,(S=a>22&&a<250?S+1:0)>45&&w>.75&&(w-=.25,S=0,W()),p||(D+=h),!M&&document.querySelector(".intro[data-state='playing']"))return;let c=function(t,e,i){let o,s=Math.min(e,i),n=.3*i,l=.7*i,a=function(){let t={x:0,y:0,radius:0};for(let e of r.X)t[e]=0;return t}(),h=0,c=0;for(let{element:o,anchor:u,state:d}of t){let t=o.getBoundingClientRect(),m=Math.min(t.bottom,l)-Math.max(t.top,n);if(m<=0)continue;let p=m/(l-n),f=u.getBoundingClientRect();for(let t of(h+=p,c=Math.max(c,p),a.x+=p*((f.left+f.width/2-e/2)/s),a.y+=p*(-(f.top+f.height/2-i/2)/s),a.radius+=p*(Math.min(f.width,f.height)/2/s),r.X))a[t]+=p*d[t]}if(0===h)return null;for(let t of(a.x/=h,a.y/=h,a.radius/=h,r.X))a[t]/=h;let u=(o=Math.min(1,Math.max(0,(c/h-.62)/(.96-.62))))*o*(3-2*o);for(let t of r.k)a[t]*=u;return a}(_,P,z);if(c){let t=A??N,e=t&&c.fill<.5?{...c,...t}:c;M=p?e:M?function(t,e,i){let o={...t};for(let s of(o.x=u(t.x,e.x,9,i),o.y=u(t.y,e.y,9,i),o.radius=u(t.radius,e.radius,3.4,i),r.X))o[s]=u(t[s],e[s],3.4,i);return o}(M,e,h):{...e,radius:.08*e.radius,heat:1}}if(!M)return;F.x=u(F.x,F.targetX,6,h),F.y=u(F.y,F.targetY,6,h);let d=M.fill>.55?"dark":"light";o.dataset.tone!==d&&(o.dataset.tone=d);let m=Math.round(16*Math.min(1,M.heat*M.dim))/16;m!==k&&(k=m,o.style.setProperty("--warmth",String(m))),i.uniform2f(t.uRes,e.width,e.height),i.uniform1f(t.uTime,D),i.uniform2f(t.uPointer,F.x,F.y),i.uniform3f(t.uTexAspect,y[0],y[1],y[2]),i.uniform3f(t.uLoaded,T[0],T[1],T[2]),i.uniform1f(t.uLogoAspect,x),n=t,l={...M,logo:M.logo*b},i.uniform2f(n.uCenter,l.x,l.y),i.uniform1f(n.uRadius,Math.max(l.radius*l.scale,.02)),i.uniform1f(n.uHeat,l.heat),i.uniform1f(n.uSuck,l.suck),i.uniform1f(n.uWave,l.wave),i.uniform1f(n.uSplit,l.split),i.uniform1f(n.uFill,l.fill),i.uniform1f(n.uDim,l.dim),i.uniform3f(n.uPhoto,l.photoInfrared,l.photoVacuum,l.photoRoller),i.uniform1f(n.uPull,.42+.5*l.suck),i.uniform1f(n.uLogo,l.logo),i.disable(i.SCISSOR_TEST),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),(t=>{if(t.fill>.002)return i.disable(i.SCISSOR_TEST);let o=e.width/P,r=Math.min(P,z),s=t.radius*t.scale*r*(2.5+.75*t.split),n=P/2+t.x*r,l=z/2+t.y*r,a=Math.max(0,Math.floor((n-s)*o)),h=Math.max(0,Math.floor((l-s)*o)),c=Math.min(e.width,Math.ceil((n+s)*o)),u=Math.min(e.height,Math.ceil((l+s)*o));i.enable(i.SCISSOR_TEST),i.scissor(a,h,Math.max(0,c-a),Math.max(0,u-h))})(M),i.drawArrays(i.TRIANGLES,0,3)},Y=()=>{cancelAnimationFrame(C),"visible"===document.visibilityState&&(O=performance.now(),C=requestAnimationFrame(X))};return W(),e.dataset.ready="true",C=requestAnimationFrame(X),window.addEventListener("resize",W),window.addEventListener("pointermove",H,{passive:!0}),document.addEventListener("pointerover",I,{passive:!0}),document.addEventListener("focusin",I),document.addEventListener("focusout",B),window.addEventListener(r.t,U),document.addEventListener("visibilitychange",Y),()=>{cancelAnimationFrame(C),R.forEach(t=>t()),L(),m.current=()=>void 0,window.removeEventListener(r.t,U),window.removeEventListener("resize",W),window.removeEventListener("pointermove",H),document.removeEventListener("pointerover",I),document.removeEventListener("focusin",I),document.removeEventListener("focusout",B),document.removeEventListener("visibilitychange",Y),delete o.dataset.tone,o.style.removeProperty("--warmth")}},[f,v,g]),(0,e.jsx)("canvas",{ref:d,className:"living-form","aria-hidden":"true"})}],5728)},83301,t=>{"use strict";let e={heat:.12,suck:0,wave:0,split:0,fill:0,dim:1,scale:1,photoInfrared:0,photoVacuum:0,photoRoller:0,logo:0},i={hero:{...e,heat:.22,logo:1},manifesto:{...e,heat:.05,dim:.85},infrared:{...e,heat:.7,scale:1.04,photoInfrared:1},vacuum:{...e,suck:1,scale:1.1,photoVacuum:1},roller:{...e,wave:1,scale:1.04,photoRoller:1},ritual:{...e,heat:.3,split:1,scale:.72},quiet:{...e,heat:.08,dim:.55},warmth:{...e,heat:1,scale:.9},waist:{...e,suck:1,heat:.2,scale:.95},ridges:{...e,wave:1,heat:.2,scale:.9},lens:{...e,heat:.35,logo:1},book:{...e,heat:.6,fill:1}};t.s(["X",0,["heat","suck","wave","split","fill","dim","scale","photoInfrared","photoVacuum","photoRoller","logo"],"t",0,"bf:form-show","n",0,i,"k",0,["photoInfrared","photoVacuum","photoRoller"],"l",0,["infrared","vacuum","roller"],"u",0,{infrared:{photoInfrared:1,heat:.6,dim:1,logo:0},vacuum:{photoVacuum:1,suck:.8,dim:1,logo:0},roller:{photoRoller:1,wave:1,dim:1,logo:0},ritual:{split:1,scale:.72,heat:.3,dim:1,logo:0}},"C",0,function(t){return void 0!==t&&t in i}])},62746,t=>{"use strict";var e=t.i(18566),i=t.i(71645);t.s(["ScrollEffects",0,function(){let t=(0,e.usePathname)();return(0,i.useEffect)(()=>{let t=Array.from(document.querySelectorAll("[data-scroll-lit]"));if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void t.forEach(t=>t.style.setProperty("--p","1"));let e=Array.from(document.querySelectorAll("[data-parallax]")).map(t=>({element:t,speed:Number(t.dataset.parallax)||0})),i=document.documentElement,o=0,r=window.scrollY,s=()=>{o=requestAnimationFrame(s);let n=window.innerHeight,l=window.scrollY;if(Math.abs(l-r)>=6||l<140){let t=l>140&&l>r?"hidden":"shown";i.dataset.header!==t&&(i.dataset.header=t),r=l}for(let{element:t,speed:i}of e){let e=t.getBoundingClientRect();if(e.bottom<-(.25*n)||e.top>1.25*n)continue;let o=Number(t.dataset.drift)||0,r=Math.round((e.top-o+e.height/2-n/2)*i*10)/10;r!==o&&(t.dataset.drift=String(r),t.style.transform=`translate3d(0, ${r}px, 0)`)}for(let e of t){let t=e.getBoundingClientRect();if(t.bottom<0||t.top>n)continue;let i=(.88*n-t.top)/(.55*n);e.style.setProperty("--p",Math.min(1,Math.max(0,i)).toFixed(3))}};return o=requestAnimationFrame(s),()=>{cancelAnimationFrame(o),delete i.dataset.header}},[t]),null}])},21131,t=>{"use strict";var e="1.3.27";function i(t,e,i){return Math.max(t,Math.min(e,i))}var o=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(t){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=t;let o=i(0,this.currentTime/this.duration,1),r=(e=o>=1)?1:this.easing(o);this.value=this.from+(this.to-this.from)*r}else if(this.lerp){var o,r,s,n;this.value=(o=this.value,r=this.to,s=60*this.lerp,(1-(n=1-Math.exp(-s*t)))*o+n*r),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,e=!0)}else this.value=this.to,e=!0;e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(t,e,{lerp:i,duration:o,easing:r,onStart:s,onUpdate:n}){this.from=this.value=t,this.to=e,this.lerp=i,this.duration=o,this.easing=r,this.currentTime=0,this.isRunning=!0,s?.(),this.onUpdate=n}},r=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(t,e,{autoResize:i=!0,debounce:o=250}={}){if(this.wrapper=t,this.content=e,i){var r;let t;this.debouncedResize=(r=this.resize,function(...e){clearTimeout(t),t=setTimeout(()=>{t=void 0,r.apply(this,e)},o)}),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)}this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},s=class{events={};emit(t,...e){let i=this.events[t]||[];for(let t=0,o=i.length;t<o;t++)i[t]?.(...e)}on(t,e){return this.events[t]?this.events[t].push(e):this.events[t]=[e],()=>{this.events[t]=this.events[t]?.filter(t=>e!==t)}}off(t,e){this.events[t]=this.events[t]?.filter(t=>e!==t)}destroy(){this.events={}}};let n=100/6,l={passive:!1};function a(t,e){return 1===t?n:2===t?e:1}var h=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new s;constructor(t,e={wheelMultiplier:1,touchMultiplier:1}){this.element=t,this.options=e,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,l),this.element.addEventListener("touchstart",this.onTouchStart,l),this.element.addEventListener("touchmove",this.onTouchMove,l),this.element.addEventListener("touchend",this.onTouchEnd,l)}on(t,e){return this.emitter.on(t,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,l),this.element.removeEventListener("touchstart",this.onTouchStart,l),this.element.removeEventListener("touchmove",this.onTouchMove,l),this.element.removeEventListener("touchend",this.onTouchEnd,l)}onTouchStart=t=>{let{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{let{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t,o=-(e-this.touchStart.x)*this.options.touchMultiplier,r=-(i-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:o,y:r},this.emitter.emit("scroll",{deltaX:o,deltaY:r,event:t})};onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:e,deltaY:i,deltaMode:o}=t,r=a(o,this.window.width),s=a(o,this.window.height);e*=r,i*=s,e*=this.options.wheelMultiplier,i*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:i,event:t})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};let c=t=>Math.min(1,1.001-2**(-10*t));var u=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)");isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new o;emitter=new s;dimensions;virtualScroll;constructor({wrapper:t=window,content:i=document.documentElement,eventsTarget:o=t,smoothWheel:s=!0,syncTouch:n=!1,syncTouchLerp:l=.075,touchInertiaExponent:a=1.7,duration:u,easing:d,lerp:m=.1,infinite:p=!1,orientation:f="vertical",gestureOrientation:v="horizontal"===f?"both":"vertical",touchMultiplier:g=1,wheelMultiplier:w=1,autoResize:S=!0,prevent:E,virtualScroll:y,overscroll:T=!0,autoRaf:R=!1,anchors:x=!1,autoToggle:b=!1,allowNestedScroll:L=!1,__experimental__naiveDimensions:_=!1,naiveDimensions:M=_,stopInertiaOnNavigate:A=!1,respectReducedMotion:N=!0}={}){window.lenisVersion=e,window.lenis||(window.lenis={}),window.lenis.version=e,"horizontal"===f&&(window.lenis.horizontal=!0),!0===n&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),t&&t!==document.documentElement||(t=window),"number"==typeof u&&"function"!=typeof d?d=c:"function"==typeof d&&"number"!=typeof u&&(u=1),this.options={wrapper:t,content:i,eventsTarget:o,smoothWheel:s,syncTouch:n,syncTouchLerp:l,touchInertiaExponent:a,duration:u,easing:d,lerp:m,infinite:p,gestureOrientation:v,orientation:f,touchMultiplier:g,wheelMultiplier:w,autoResize:S,prevent:E,virtualScroll:y,overscroll:T,autoRaf:R,anchors:x,autoToggle:b,allowNestedScroll:L,naiveDimensions:M,stopInertiaOnNavigate:A,respectReducedMotion:N},this.dimensions=new r(t,i,{autoResize:S}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new h(o,{touchMultiplier:g,wheelMultiplier:w}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(t,e){return this.emitter.on(t,e)}off(t,e){return this.emitter.off(t,e)}onScrollEnd=t=>{t instanceof CustomEvent||"smooth"!==this.isScrolling&&!1!==this.isScrolling||t.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let t=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[t]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=t=>{t.propertyName?.includes("overflow")&&t.target===this.rootElement&&this.checkOverflow()};setScroll(t){this.isHorizontal?this.options.wrapper.scrollTo({left:t,behavior:"instant"}):this.options.wrapper.scrollTo({top:t,behavior:"instant"})}onClick=t=>{let e=t.composedPath().filter(t=>t instanceof HTMLAnchorElement&&t.href).map(t=>new URL(t.href)),i=new URL(window.location.href);if(this.options.anchors){let t=e.find(t=>i.host===t.host&&i.pathname===t.pathname&&t.hash);if(t){let e="object"==typeof this.options.anchors&&this.options.anchors?this.options.anchors:void 0,i=decodeURIComponent(t.hash);this.scrollTo(i,e);return}}if(this.options.stopInertiaOnNavigate&&e.some(t=>i.host===t.host&&i.pathname!==t.pathname))return void this.reset()};onPointerDown=t=>{1===t.button&&this.reset()};isTouchOnSelectionHandle(t){let e=window.getSelection();if(!e||e.isCollapsed||0===e.rangeCount)return!1;let i=t.targetTouches[0]??t.changedTouches[0];if(!i)return!1;let o=e.getRangeAt(0).getClientRects();if(0===o.length)return!1;let r=o[0],s=o[o.length-1],n=40>=Math.hypot(i.clientX-r.left,i.clientY-r.top),l=40>=Math.hypot(i.clientX-s.right,i.clientY-s.bottom);return n||l}onVirtualScroll=t=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(t))return;let{deltaX:e,deltaY:i,event:o}=t;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:i,event:o}),o.ctrlKey||o.lenisStopPropagation)return;let r=o.type.includes("touch"),s=o.type.includes("wheel");if(r&&this.isIos&&("touchstart"===o.type&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(o)),this._isDraggingSelection)){"touchend"===o.type&&(this._isDraggingSelection=!1);return}this.isTouching="touchstart"===o.type||"touchmove"===o.type;let n=0===e&&0===i;if(this.options.syncTouch&&r&&"touchstart"===o.type&&n&&!this.isStopped&&!this.isLocked)return void this.reset();let l="vertical"===this.options.gestureOrientation&&0===i||"horizontal"===this.options.gestureOrientation&&0===e;if(n||l)return;let a=o.composedPath();a=a.slice(0,a.indexOf(this.rootElement));let h=this.options.prevent,c=Math.abs(e)>=Math.abs(i)?"horizontal":"vertical";if(a.find(t=>t instanceof HTMLElement&&("function"==typeof h&&h?.(t)||t.hasAttribute?.("data-lenis-prevent")||"vertical"===c&&t.hasAttribute?.("data-lenis-prevent-vertical")||"horizontal"===c&&t.hasAttribute?.("data-lenis-prevent-horizontal")||r&&t.hasAttribute?.("data-lenis-prevent-touch")||s&&t.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(t,{deltaX:e,deltaY:i}))))return;if(this.isStopped||this.isLocked){o.cancelable&&o.preventDefault();return}if(!(this.options.syncTouch&&r||this.options.smoothWheel&&s)){this.isScrolling="native",this.animate.stop(),o.lenisStopPropagation=!0;return}let u=i;"both"===this.options.gestureOrientation?u=Math.abs(i)>Math.abs(e)?i:e:"horizontal"===this.options.gestureOrientation&&(u=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||0===this.animatedScroll&&i>0||this.animatedScroll===this.limit&&i<0))&&(o.lenisStopPropagation=!0),o.cancelable&&o.preventDefault();let d=r&&this.options.syncTouch,m=r&&"touchend"===o.type;m&&(u=Math.sign(u)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+u,{programmatic:!1,...d?{lerp:m?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(!1===this.isScrolling||"native"===this.isScrolling){let t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isStopped||(this.isScrolling="native"),this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle)return void this.rootElement.style.removeProperty("overflow");this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle)return void this.rootElement.style.setProperty("overflow","clip");this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=t=>{let e=t-(this.time||t);this.time=t,this.animate.advance(.001*e),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(t,{offset:e=0,immediate:o=!1,lock:r=!1,programmatic:s=!0,lerp:n=s?this.options.lerp:void 0,duration:l=s?this.options.duration:void 0,easing:a=s?this.options.easing:void 0,onStart:h,onComplete:u,force:d=!1,userData:m}={}){if(this.prefersReducedMotion&&(s?o=!0:(n=1,l=void 0,a=void 0)),(this.isStopped||this.isLocked)&&!d)return;let p=t,f=e;if("string"==typeof p&&["top","left","start","#"].includes(p))p=0;else if("string"==typeof p&&["bottom","right","end"].includes(p))p=this.limit;else{let t=null;if("string"==typeof p?(t=p.startsWith("#")?document.getElementById(p.slice(1)):document.querySelector(p))||("#top"===p?p=0:console.warn("Lenis: Target not found",p)):p instanceof Element&&(t=p),t){if(this.options.wrapper!==window){let t=this.rootElement.getBoundingClientRect();f-=this.isHorizontal?t.left:t.top}let e=t.getBoundingClientRect(),i=getComputedStyle(t),o=this.isHorizontal?Number.parseFloat(i.scrollMarginLeft):Number.parseFloat(i.scrollMarginTop),r=getComputedStyle(this.rootElement),s=this.isHorizontal?Number.parseFloat(r.scrollPaddingLeft):Number.parseFloat(r.scrollPaddingTop);p=(this.isHorizontal?e.left:e.top)+this.animatedScroll-(Number.isNaN(o)?0:o)-(Number.isNaN(s)?0:s)}}if("number"==typeof p){if(p+=f,this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;let t=p-this.animatedScroll;t>this.limit/2?p-=this.limit:t<-this.limit/2&&(p+=this.limit)}}else p=i(0,p,this.limit);if(p===this.targetScroll){h?.(this),u?.(this);return}if(this.userData=m??{},o){this.animatedScroll=this.targetScroll=p,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=p),"number"==typeof l&&"function"!=typeof a?a=c:"function"==typeof a&&"number"!=typeof l&&(l=1),this.animate.fromTo(this.animatedScroll,p,{duration:l,easing:a,lerp:n,onStart:()=>{r&&(this.isLocked=!0),this.isScrolling="smooth",h?.(this)},onUpdate:(t,e)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),s&&(this.targetScroll=t),e||this.emit(),e&&(this.reset(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(t,{deltaX:e,deltaY:i}){let o,r,s,n,l,a,h,c,u,d,m,p,f,v,g,w,S=Date.now();t._lenis||(t._lenis={});let E=t._lenis;if(S-(E.time??0)>2e3){E.time=Date.now();let e=window.getComputedStyle(t);if(E.computedStyle=e,o=["auto","overlay","scroll"].includes(e.overflowX),r=["auto","overlay","scroll"].includes(e.overflowY),l=["auto"].includes(e.overscrollBehaviorX),a=["auto"].includes(e.overscrollBehaviorY),E.hasOverflowX=o,E.hasOverflowY=r,!(o||r))return!1;h=t.scrollWidth,c=t.scrollHeight,u=t.clientWidth,d=t.clientHeight,s=h>u,n=c>d,E.isScrollableX=s,E.isScrollableY=n,E.scrollWidth=h,E.scrollHeight=c,E.clientWidth=u,E.clientHeight=d,E.hasOverscrollBehaviorX=l,E.hasOverscrollBehaviorY=a}else s=E.isScrollableX,n=E.isScrollableY,o=E.hasOverflowX,r=E.hasOverflowY,h=E.scrollWidth,c=E.scrollHeight,u=E.clientWidth,d=E.clientHeight,l=E.hasOverscrollBehaviorX,a=E.hasOverscrollBehaviorY;if(!(o&&s||r&&n))return!1;let y=Math.abs(e)>=Math.abs(i)?"horizontal":"vertical";if("horizontal"===y)m=Math.round(t.scrollLeft),p=h-u,f=e,v=o,g=s,w=l;else{if("vertical"!==y)return!1;m=Math.round(t.scrollTop),p=c-d,f=i,v=r,g=n,w=a}return!w&&(m>=p||m<=0)||(f>0?m<p:m>0)&&v&&g}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){let t=this.options.wrapper;return this.isHorizontal?t.scrollX??t.scrollLeft:t.scrollY??t.scrollTop}get scroll(){var t;return this.options.infinite?(this.animatedScroll%(t=this.limit)+t)%t:this.animatedScroll}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let t="lenis";return this.options.autoToggle&&(t+=" lenis-autoToggle"),this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),"smooth"===this.isScrolling&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(t=>{this.rootElement.classList.add(t)})}cleanUpClassName(){for(let t of Array.from(this.rootElement.classList))("lenis"===t||t.startsWith("lenis-"))&&this.rootElement.classList.remove(t)}},d=t.i(18566),m=t.i(71645);let p="bf:scroll-lock",f="bf:scroll-unlock";t.s(["SCROLL_LOCK_EVENT",0,p,"SCROLL_UNLOCK_EVENT",0,f,"SmoothScroll",0,function(){let t=(0,m.useRef)(null),e=(0,d.usePathname)();return(0,m.useEffect)(()=>{t.current?.scrollTo(0,{immediate:!0,force:!0})},[e]),(0,m.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let e=new u({lerp:.09,anchors:!0});t.current=e;let i=requestAnimationFrame(function t(o){e.raf(o),i=requestAnimationFrame(t)}),o=()=>e.stop(),r=()=>e.start();return window.addEventListener(p,o),window.addEventListener(f,r),()=>{cancelAnimationFrame(i),window.removeEventListener(p,o),window.removeEventListener(f,r),e.destroy(),t.current=null}},[]),null}],21131)}]);