(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18566,(e,t,i)=>{t.exports=e.r(76562)},96726,e=>{"use strict";var t=e.i(43476),i=e.i(71645);let o="bf-intro-seen",s=`try{if(sessionStorage.getItem('${o}'))document.documentElement.setAttribute('data-intro-seen','')}catch(e){}`;function r(e){return new Promise(t=>window.setTimeout(t,e))}function n(){return(0,t.jsxs)("div",{className:"intro__face",children:[(0,t.jsx)("div",{className:"intro__light"}),(0,t.jsx)("div",{className:"intro__frame"}),(0,t.jsxs)("div",{className:"intro__mark",children:[(0,t.jsxs)("div",{className:"intro__monogram",children:[(0,t.jsx)("img",{src:"/bella-figura-next-preview/brand/monogram.svg",alt:"",width:1336,height:1336,fetchPriority:"high"}),(0,t.jsx)("span",{className:"intro__sheen",children:(0,t.jsx)("span",{className:"intro__sheen-band"})})]}),(0,t.jsx)("img",{src:"/bella-figura-next-preview/brand/wordmark.svg",alt:"",width:3620,height:792,className:"intro__wordmark",fetchPriority:"high"}),(0,t.jsx)("p",{className:"intro__line caps",children:"The art of feeling exceptional"}),(0,t.jsx)("span",{className:"intro__progress"})]})]})}e.s(["Intro",0,function(){let[e,l]=(0,i.useState)("playing");return((0,i.useEffect)(()=>{if(document.documentElement.hasAttribute("data-intro-seen"))return void l("done");try{sessionStorage.setItem(o,"1")}catch{}let e=window.matchMedia("(prefers-reduced-motion: reduce)").matches,t=!1,i=()=>{t||l(e=>"playing"===e?"opening":e)};return Promise.race([Promise.all(["complete"===document.readyState?Promise.resolve():new Promise(e=>window.addEventListener("load",()=>e(),{once:!0})),r(e?1500:2700)]),r(5200)]).then(i),window.addEventListener("keydown",i),()=>{t=!0,window.removeEventListener("keydown",i)}},[]),(0,i.useEffect)(()=>{if("opening"!==e)return;let t=window.matchMedia("(prefers-reduced-motion: reduce)").matches,i=window.setTimeout(()=>l("done"),t?500:1750);return()=>window.clearTimeout(i)},[e]),"done"===e)?null:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("script",{dangerouslySetInnerHTML:{__html:s}}),(0,t.jsxs)("div",{className:"intro","data-state":e,"aria-hidden":"true",onPointerDown:()=>l("opening"),children:[(0,t.jsx)("div",{className:"intro__sun"}),(0,t.jsx)("div",{className:"intro__leaf intro__leaf--left",children:(0,t.jsx)(n,{})}),(0,t.jsx)("div",{className:"intro__leaf intro__leaf--right",children:(0,t.jsx)(n,{})}),(0,t.jsx)("div",{className:"intro__seam"})]})]})}])},5728,e=>{"use strict";var t=e.i(43476),i=e.i(18566),o=e.i(71645),s=e.i(83301);let r=`#version 300 es
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

  // Only the body itself (and a few pixels of margin for its soft edge) needs shading;
  // the halo and shadow around it are computed from the distance alone, further down.
  vec3 color = vec3(0.0);
  float aa = 1.5 / unit;
  bool shaded = d < aa * 3.0;
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
  if (shaded) {
  color = mix(GOLD, PEARL, smoothstep(0.12, 0.92, diffuse));

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
  // The guards below read uniforms only, so every pixel takes the same path: when no photo
  // is showing (most of the time) the three texture lookups are skipped entirely.
  bool splitting = uSplit > 0.001;
  bool anyPhoto = splitting || uPhoto.x + uPhoto.y + uPhoto.z > 0.001;
  float presence = 0.0;
  float ridgePhase = (p.y - uCenter.y) / R * 17.0 - uTime * 2.2;
  if (anyPhoto) {
    vec2 o1, o2, o3;
    bodyOffsets(o1, o2, o3);
    vec2 c1 = uCenter + o1;
    vec2 c2 = uCenter + o2;
    vec2 c3 = uCenter + o3;
    vec3 nearest = exp(-vec3(length(p - c1), length(p - c2) / BODY_2, length(p - c3) / BODY_3) / (R * 0.1));
    nearest /= nearest.x + nearest.y + nearest.z;
    vec3 weights = mix(uPhoto, nearest, uSplit) * uLoaded;
    presence = clamp(weights.x + weights.y + weights.z, 0.0, 1.0);

    vec2 warp = -g * (1.0 - z) * 0.05 + vec2(uWave * 0.005 * sin(ridgePhase), 0.0);
    vec3 photo = vec3(0.0);
    if (splitting || uPhoto.x > 0.001) photo += lens(uTex0, uTexAspect.x, p, c1, rb, warp) * weights.x;
    if (splitting || uPhoto.y > 0.001) photo += lens(uTex1, uTexAspect.y, p, c2, rb * mix(1.0, BODY_2, uSplit), warp) * weights.y;
    if (splitting || uPhoto.z > 0.001) photo += lens(uTex2, uTexAspect.z, p, c3, rb * mix(1.0, BODY_3, uSplit), warp) * weights.z;
    photo /= max(weights.x + weights.y + weights.z, 1e-4);
    photo = mix(photo, photo * vec3(1.1, 0.93, 0.86), uHeat * 0.45);
    float window = smoothstep(0.08, 0.3, depth) * presence;
    color = mix(color, photo, window);
  }

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

  // Flooded: a slow, dark ember current (skipped, noise and all, unless the screen is flooding).
  if (uFill > 0.002) {
    float current = fbm(p * 1.4 + vec2(uTime * 0.04, -uTime * 0.03));
    vec3 night = NIGHT * (0.75 + 0.7 * current) + EMBER * 0.1 * pow(current, 3.0);
    color = mix(color, night, smoothstep(0.0, 1.0, uFill));
  }

  }

  float inside = smoothstep(aa, -aa, d);

  // Warm halo, with slow rings when heated.
  float outside = max(d, 0.0);
  float halo = exp(-outside / (R * 0.32)) * (0.1 + 0.42 * uHeat);
  if (uHeat > 0.001) halo += uHeat * 0.09 * (0.5 + 0.5 * sin(outside / R * 24.0 - uTime * 2.2)) * exp(-outside / (R * 0.55));
  vec3 haloColor = mix(GOLD, EMBER, uHeat * 0.85);

  float grain = hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5;
  color += grain * 0.03;

  // Soft shadow cast down and to the right, so the body sits above the page.
  // Only pixels just outside the body can be in shadow (it falls ~0.5R away), so the second
  // field lookup is skipped inside the body and out in the halo.
  float shadow = 0.0;
  if (inside < 0.999 && uFill < 0.98 && d < R * 0.6) {
    float dropped = field(p + vec2(-0.035, 0.05) * (R / 0.35));
    shadow = smoothstep(R * 0.3, -R * 0.1, dropped) * 0.2 * (1.0 - uFill);
  }
  vec3 shadowColor = vec3(0.30, 0.17, 0.10);

  float outer = 1.0 - inside;
  float alpha = inside + (halo + shadow * (1.0 - halo)) * outer;
  vec3 rgb = color * inside + (haloColor * halo + shadowColor * shadow * (1.0 - halo)) * outer;
  outColor = vec4(rgb, alpha) * uDim;
}
`,l=["uRes","uTime","uCenter","uRadius","uHeat","uSuck","uWave","uSplit","uFill","uDim","uPointer","uPull","uTex0","uTex1","uTex2","uTexAspect","uLoaded","uPhoto","uTex3","uLogo","uLogoAspect"];function a(e,t,i){let o=e.createShader(t);if(!o)throw Error("Could not create shader");if(e.shaderSource(o,i),e.compileShader(o),!e.getShaderParameter(o,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(o)??"Shader failed to compile");return o}function h(e,t,i,o){let s=e.createTexture();if(e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,s),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([236,222,204,255])),!i)return()=>void 0;let r=!1,n=new Image;return n.decoding="async",n.onload=()=>{r||e.isContextLost()||(e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,s),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,n),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),o(n.naturalWidth/n.naturalHeight))},n.src=i,()=>{r=!0}}let c=1e3/60,u=1e3/144;function d(){return Array.from(document.querySelectorAll("[data-form]")).flatMap(e=>{let t=e.dataset.form;if(!(0,s.C)(t))return[];let i=e.querySelector("[data-form-anchor]")??e;return[{element:e,anchor:i,state:s.n[t]}]})}function m(e,t,i,o){return e+(t-e)*(1-Math.exp(-i*o))}e.s(["LivingForm",0,function({photos:e}){let p=(0,o.useRef)(null),f=(0,o.useRef)(()=>void 0),v=(0,i.usePathname)(),{infrared:g,vacuum:w,roller:S}=e;return(0,o.useEffect)(()=>{f.current()},[v]),(0,o.useEffect)(()=>{let e,t=p.current,i=t?.getContext("webgl2",{alpha:!0,antialias:!1,powerPreference:"high-performance"}),o=document.documentElement;if(!t||!i)return void o.classList.add("no-webgl");try{e=function(e){let t=e.createProgram();if(e.attachShader(t,a(e,e.VERTEX_SHADER,r)),e.attachShader(t,a(e,e.FRAGMENT_SHADER,n)),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))throw Error(e.getProgramInfoLog(t)??"Program failed to link");e.useProgram(t);let i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let o=e.getAttribLocation(t,"aPosition");e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0);let s=Object.fromEntries(l.map(i=>[i,e.getUniformLocation(t,i)]));return e.uniform1i(s.uTex0,0),e.uniform1i(s.uTex1,1),e.uniform1i(s.uTex2,2),e.uniform1i(s.uTex3,3),s}(i)}catch(e){console.error("[living-form] shader unavailable:",e),o.classList.add("no-webgl");return}let v=window.matchMedia("(prefers-reduced-motion: reduce)").matches,y=(window.matchMedia("(pointer: coarse)").matches,1.25),E=0,T=c,x=1,R={infrared:g,vacuum:w,roller:S},b=[1,1,1],_=[0,0,0],L=s.l.map((e,t)=>h(i,t,R[e],e=>{b[t]=e,_[t]=1})),M=1,P=0,A=h(i,3,"/bella-figura-next-preview/brand/emblem.png",e=>{M=e,P=1}),N=d(),z=null,C=null,O=null;f.current=()=>{N=d(),C=null,O=null};let k=0,D=0,F=0,I=performance.now(),H=0,W=-1,B={x:9,y:9,targetX:9,targetY:9},U=()=>{let e=Math.min(window.devicePixelRatio||1,y);k=t.clientWidth||window.innerWidth,D=t.clientHeight||window.innerHeight;let o=Math.round(k*e),s=Math.round(D*e);(t.width!==o||t.height!==s)&&(t.width=o,t.height=s,i.viewport(0,0,o,s)),N=d()},X=e=>{if("mouse"!==e.pointerType)return;let t=Math.min(k,D);B.targetX=(e.clientX-k/2)/t,B.targetY=-(e.clientY-D/2)/t},q=e=>{let t=e.target?.closest?.("[data-form-show]");C=t?s.u[t.dataset.formShow??""]??null:null},Y=()=>{C=null},V=e=>{let t=e.detail;O=t?s.u[t]??null:null},j=r=>{var n,l;F=requestAnimationFrame(j);let a=r-I;if(x>1&&a<T*x*.9)return;let h=Math.min(a/1e3,.05);if(I=r,a>.8*u&&(T=Math.max(u,Math.min(T,a/x))),(E=a>T*x*1.35&&a<250?E+1:0)>24&&(E=0,y>.75?(y-=.25,U()):x<2&&(x+=1)),v||(H+=h),!z&&document.querySelector(".intro[data-state='playing']"))return;let c=function(e,t,i){let o,r=Math.min(t,i),n=.3*i,l=.7*i,a=function(){let e={x:0,y:0,radius:0};for(let t of s.X)e[t]=0;return e}(),h=0,c=0;for(let{element:o,anchor:u,state:d}of e){let e=o.getBoundingClientRect(),m=Math.min(e.bottom,l)-Math.max(e.top,n);if(m<=0)continue;let p=m/(l-n),f=u.getBoundingClientRect();for(let e of(h+=p,c=Math.max(c,p),a.x+=p*((f.left+f.width/2-t/2)/r),a.y+=p*(-(f.top+f.height/2-i/2)/r),a.radius+=p*(Math.min(f.width,f.height)/2/r),s.X))a[e]+=p*d[e]}if(0===h)return null;for(let e of(a.x/=h,a.y/=h,a.radius/=h,s.X))a[e]/=h;let u=(o=Math.min(1,Math.max(0,(c/h-.62)/(.96-.62))))*o*(3-2*o);for(let e of s.k)a[e]*=u;return a}(N,k,D);if(c){let e=C??O,t=e&&c.fill<.5?{...c,...e}:c;z=v?t:z?function(e,t,i){let o={...e};for(let r of(o.x=m(e.x,t.x,9,i),o.y=m(e.y,t.y,9,i),o.radius=m(e.radius,t.radius,3.4,i),s.X))o[r]=m(e[r],t[r],3.4,i);return o}(z,t,h):{...t,radius:.08*t.radius,heat:1}}if(!z)return;B.x=m(B.x,B.targetX,6,h),B.y=m(B.y,B.targetY,6,h);let d=z.fill>.55?"dark":"light";o.dataset.tone!==d&&(o.dataset.tone=d);let p=Math.round(16*Math.min(1,z.heat*z.dim))/16;p!==W&&(W=p,o.style.setProperty("--warmth",String(p))),i.uniform2f(e.uRes,t.width,t.height),i.uniform1f(e.uTime,H),i.uniform2f(e.uPointer,B.x,B.y),i.uniform3f(e.uTexAspect,b[0],b[1],b[2]),i.uniform3f(e.uLoaded,_[0],_[1],_[2]),i.uniform1f(e.uLogoAspect,M),n=e,l={...z,logo:z.logo*P},i.uniform2f(n.uCenter,l.x,l.y),i.uniform1f(n.uRadius,Math.max(l.radius*l.scale,.02)),i.uniform1f(n.uHeat,l.heat),i.uniform1f(n.uSuck,l.suck),i.uniform1f(n.uWave,l.wave),i.uniform1f(n.uSplit,l.split),i.uniform1f(n.uFill,l.fill),i.uniform1f(n.uDim,l.dim),i.uniform3f(n.uPhoto,l.photoInfrared,l.photoVacuum,l.photoRoller),i.uniform1f(n.uPull,.42+.5*l.suck),i.uniform1f(n.uLogo,l.logo),i.disable(i.SCISSOR_TEST),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),(e=>{if(e.fill>.002)return i.disable(i.SCISSOR_TEST);let o=t.width/k,s=Math.min(k,D),r=e.radius*e.scale*s*(2.5+.75*e.split),n=k/2+e.x*s,l=D/2+e.y*s,a=Math.max(0,Math.floor((n-r)*o)),h=Math.max(0,Math.floor((l-r)*o)),c=Math.min(t.width,Math.ceil((n+r)*o)),u=Math.min(t.height,Math.ceil((l+r)*o));i.enable(i.SCISSOR_TEST),i.scissor(a,h,Math.max(0,c-a),Math.max(0,u-h))})(z),i.drawArrays(i.TRIANGLES,0,3)},G=()=>{cancelAnimationFrame(F),"visible"===document.visibilityState&&(I=performance.now(),F=requestAnimationFrame(j))};return U(),t.dataset.ready="true",F=requestAnimationFrame(j),window.addEventListener("resize",U),window.addEventListener("pointermove",X,{passive:!0}),document.addEventListener("pointerover",q,{passive:!0}),document.addEventListener("focusin",q),document.addEventListener("focusout",Y),window.addEventListener(s.t,V),document.addEventListener("visibilitychange",G),()=>{cancelAnimationFrame(F),L.forEach(e=>e()),A(),f.current=()=>void 0,window.removeEventListener(s.t,V),window.removeEventListener("resize",U),window.removeEventListener("pointermove",X),document.removeEventListener("pointerover",q),document.removeEventListener("focusin",q),document.removeEventListener("focusout",Y),document.removeEventListener("visibilitychange",G),delete o.dataset.tone,o.style.removeProperty("--warmth")}},[g,w,S]),(0,t.jsx)("canvas",{ref:p,className:"living-form","aria-hidden":"true"})}],5728)},83301,e=>{"use strict";let t={heat:.12,suck:0,wave:0,split:0,fill:0,dim:1,scale:1,photoInfrared:0,photoVacuum:0,photoRoller:0,logo:0},i={hero:{...t,heat:.22,logo:1},manifesto:{...t,heat:.05,dim:.85},infrared:{...t,heat:.7,scale:1.04,photoInfrared:1},vacuum:{...t,suck:1,scale:1.1,photoVacuum:1},roller:{...t,wave:1,scale:1.04,photoRoller:1},ritual:{...t,heat:.3,split:1,scale:.72},quiet:{...t,heat:.08,dim:.55},warmth:{...t,heat:1,scale:.9},waist:{...t,suck:1,heat:.2,scale:.95},ridges:{...t,wave:1,heat:.2,scale:.9},lens:{...t,heat:.35,logo:1},book:{...t,heat:.6,fill:1},gone:{...t,heat:0,dim:0,scale:.6}};e.s(["X",0,["heat","suck","wave","split","fill","dim","scale","photoInfrared","photoVacuum","photoRoller","logo"],"t",0,"bf:form-show","n",0,i,"k",0,["photoInfrared","photoVacuum","photoRoller"],"l",0,["infrared","vacuum","roller"],"u",0,{infrared:{photoInfrared:1,heat:.6,dim:1,logo:0},vacuum:{photoVacuum:1,suck:.8,dim:1,logo:0},roller:{photoRoller:1,wave:1,dim:1,logo:0},ritual:{split:1,scale:.72,heat:.3,dim:1,logo:0}},"C",0,function(e){return void 0!==e&&e in i}])},62746,e=>{"use strict";var t=e.i(18566),i=e.i(71645);e.s(["ScrollEffects",0,function(){let e=(0,t.usePathname)();return(0,i.useEffect)(()=>{let e=Array.from(document.querySelectorAll("[data-scroll-lit]")),t=Array.from(document.querySelectorAll("[data-night]")),i=document.documentElement,o=()=>{let e=t.some(e=>{let t=e.getBoundingClientRect();return t.top<40&&t.bottom>40})?"night":"day";i.dataset.zone!==e&&(i.dataset.zone=e)};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return e.forEach(e=>e.style.setProperty("--p","1")),o(),window.addEventListener("scroll",o,{passive:!0}),()=>{window.removeEventListener("scroll",o),delete i.dataset.zone};let s=Array.from(document.querySelectorAll("[data-parallax]")).map(e=>({element:e,speed:Number(e.dataset.parallax)||0})),r=0,n=window.scrollY,l=()=>{r=requestAnimationFrame(l);let t=window.innerHeight,a=window.scrollY;if(Math.abs(a-n)>=6||a<140){let e=a>140&&a>n?"hidden":"shown";i.dataset.header!==e&&(i.dataset.header=e),n=a}for(let{element:e,speed:i}of(o(),s)){let o=e.getBoundingClientRect();if(o.bottom<-(.25*t)||o.top>1.25*t)continue;let s=Number(e.dataset.drift)||0,r=Math.round((o.top-s+o.height/2-t/2)*i*10)/10;r!==s&&(e.dataset.drift=String(r),e.style.transform=`translate3d(0, ${r}px, 0)`)}for(let i of e){let e=i.getBoundingClientRect();if(e.bottom<0||e.top>t)continue;let o=(.88*t-e.top)/(.55*t);i.style.setProperty("--p",Math.min(1,Math.max(0,o)).toFixed(3))}};return r=requestAnimationFrame(l),()=>{cancelAnimationFrame(r),delete i.dataset.header,delete i.dataset.zone}},[e]),null}])},21131,e=>{"use strict";var t="1.3.27";function i(e,t,i){return Math.max(e,Math.min(t,i))}var o=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(e){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=e;let o=i(0,this.currentTime/this.duration,1),s=(t=o>=1)?1:this.easing(o);this.value=this.from+(this.to-this.from)*s}else if(this.lerp){var o,s,r,n;this.value=(o=this.value,s=this.to,r=60*this.lerp,(1-(n=1-Math.exp(-r*e)))*o+n*s),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)}else this.value=this.to,t=!0;t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(e,t,{lerp:i,duration:o,easing:s,onStart:r,onUpdate:n}){this.from=this.value=e,this.to=t,this.lerp=i,this.duration=o,this.easing=s,this.currentTime=0,this.isRunning=!0,r?.(),this.onUpdate=n}},s=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(e,t,{autoResize:i=!0,debounce:o=250}={}){if(this.wrapper=e,this.content=t,i){var s;let e;this.debouncedResize=(s=this.resize,function(...t){clearTimeout(e),e=setTimeout(()=>{e=void 0,s.apply(this,t)},o)}),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)}this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},r=class{events={};emit(e,...t){let i=this.events[e]||[];for(let e=0,o=i.length;e<o;e++)i[e]?.(...t)}on(e,t){return this.events[e]?this.events[e].push(t):this.events[e]=[t],()=>{this.events[e]=this.events[e]?.filter(e=>t!==e)}}off(e,t){this.events[e]=this.events[e]?.filter(e=>t!==e)}destroy(){this.events={}}};let n=100/6,l={passive:!1};function a(e,t){return 1===e?n:2===e?t:1}var h=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new r;constructor(e,t={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=t,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,l),this.element.addEventListener("touchstart",this.onTouchStart,l),this.element.addEventListener("touchmove",this.onTouchMove,l),this.element.addEventListener("touchend",this.onTouchEnd,l)}on(e,t){return this.emitter.on(e,t)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,l),this.element.removeEventListener("touchstart",this.onTouchStart,l),this.element.removeEventListener("touchmove",this.onTouchMove,l),this.element.removeEventListener("touchend",this.onTouchEnd,l)}onTouchStart=e=>{let{clientX:t,clientY:i}=e.targetTouches?e.targetTouches[0]:e;this.touchStart.x=t,this.touchStart.y=i,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:e})};onTouchMove=e=>{let{clientX:t,clientY:i}=e.targetTouches?e.targetTouches[0]:e,o=-(t-this.touchStart.x)*this.options.touchMultiplier,s=-(i-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=i,this.lastDelta={x:o,y:s},this.emitter.emit("scroll",{deltaX:o,deltaY:s,event:e})};onTouchEnd=e=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:e})};onWheel=e=>{let{deltaX:t,deltaY:i,deltaMode:o}=e,s=a(o,this.window.width),r=a(o,this.window.height);t*=s,i*=r,t*=this.options.wheelMultiplier,i*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:t,deltaY:i,event:e})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};let c=e=>Math.min(1,1.001-2**(-10*e));var u=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)");isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new o;emitter=new r;dimensions;virtualScroll;constructor({wrapper:e=window,content:i=document.documentElement,eventsTarget:o=e,smoothWheel:r=!0,syncTouch:n=!1,syncTouchLerp:l=.075,touchInertiaExponent:a=1.7,duration:u,easing:d,lerp:m=.1,infinite:p=!1,orientation:f="vertical",gestureOrientation:v="horizontal"===f?"both":"vertical",touchMultiplier:g=1,wheelMultiplier:w=1,autoResize:S=!0,prevent:y,virtualScroll:E,overscroll:T=!0,autoRaf:x=!1,anchors:R=!1,autoToggle:b=!1,allowNestedScroll:_=!1,__experimental__naiveDimensions:L=!1,naiveDimensions:M=L,stopInertiaOnNavigate:P=!1,respectReducedMotion:A=!0}={}){window.lenisVersion=t,window.lenis||(window.lenis={}),window.lenis.version=t,"horizontal"===f&&(window.lenis.horizontal=!0),!0===n&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),e&&e!==document.documentElement||(e=window),"number"==typeof u&&"function"!=typeof d?d=c:"function"==typeof d&&"number"!=typeof u&&(u=1),this.options={wrapper:e,content:i,eventsTarget:o,smoothWheel:r,syncTouch:n,syncTouchLerp:l,touchInertiaExponent:a,duration:u,easing:d,lerp:m,infinite:p,gestureOrientation:v,orientation:f,touchMultiplier:g,wheelMultiplier:w,autoResize:S,prevent:y,virtualScroll:E,overscroll:T,autoRaf:x,anchors:R,autoToggle:b,allowNestedScroll:_,naiveDimensions:M,stopInertiaOnNavigate:P,respectReducedMotion:A},this.dimensions=new s(e,i,{autoResize:S}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new h(o,{touchMultiplier:g,wheelMultiplier:w}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(e,t){return this.emitter.on(e,t)}off(e,t){return this.emitter.off(e,t)}onScrollEnd=e=>{e instanceof CustomEvent||"smooth"!==this.isScrolling&&!1!==this.isScrolling||e.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let e=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[e]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=e=>{e.propertyName?.includes("overflow")&&e.target===this.rootElement&&this.checkOverflow()};setScroll(e){this.isHorizontal?this.options.wrapper.scrollTo({left:e,behavior:"instant"}):this.options.wrapper.scrollTo({top:e,behavior:"instant"})}onClick=e=>{let t=e.composedPath().filter(e=>e instanceof HTMLAnchorElement&&e.href).map(e=>new URL(e.href)),i=new URL(window.location.href);if(this.options.anchors){let e=t.find(e=>i.host===e.host&&i.pathname===e.pathname&&e.hash);if(e){let t="object"==typeof this.options.anchors&&this.options.anchors?this.options.anchors:void 0,i=decodeURIComponent(e.hash);this.scrollTo(i,t);return}}if(this.options.stopInertiaOnNavigate&&t.some(e=>i.host===e.host&&i.pathname!==e.pathname))return void this.reset()};onPointerDown=e=>{1===e.button&&this.reset()};isTouchOnSelectionHandle(e){let t=window.getSelection();if(!t||t.isCollapsed||0===t.rangeCount)return!1;let i=e.targetTouches[0]??e.changedTouches[0];if(!i)return!1;let o=t.getRangeAt(0).getClientRects();if(0===o.length)return!1;let s=o[0],r=o[o.length-1],n=40>=Math.hypot(i.clientX-s.left,i.clientY-s.top),l=40>=Math.hypot(i.clientX-r.right,i.clientY-r.bottom);return n||l}onVirtualScroll=e=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(e))return;let{deltaX:t,deltaY:i,event:o}=e;if(this.emitter.emit("virtual-scroll",{deltaX:t,deltaY:i,event:o}),o.ctrlKey||o.lenisStopPropagation)return;let s=o.type.includes("touch"),r=o.type.includes("wheel");if(s&&this.isIos&&("touchstart"===o.type&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(o)),this._isDraggingSelection)){"touchend"===o.type&&(this._isDraggingSelection=!1);return}this.isTouching="touchstart"===o.type||"touchmove"===o.type;let n=0===t&&0===i;if(this.options.syncTouch&&s&&"touchstart"===o.type&&n&&!this.isStopped&&!this.isLocked)return void this.reset();let l="vertical"===this.options.gestureOrientation&&0===i||"horizontal"===this.options.gestureOrientation&&0===t;if(n||l)return;let a=o.composedPath();a=a.slice(0,a.indexOf(this.rootElement));let h=this.options.prevent,c=Math.abs(t)>=Math.abs(i)?"horizontal":"vertical";if(a.find(e=>e instanceof HTMLElement&&("function"==typeof h&&h?.(e)||e.hasAttribute?.("data-lenis-prevent")||"vertical"===c&&e.hasAttribute?.("data-lenis-prevent-vertical")||"horizontal"===c&&e.hasAttribute?.("data-lenis-prevent-horizontal")||s&&e.hasAttribute?.("data-lenis-prevent-touch")||r&&e.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(e,{deltaX:t,deltaY:i}))))return;if(this.isStopped||this.isLocked){o.cancelable&&o.preventDefault();return}if(!(this.options.syncTouch&&s||this.options.smoothWheel&&r)){this.isScrolling="native",this.animate.stop(),o.lenisStopPropagation=!0;return}let u=i;"both"===this.options.gestureOrientation?u=Math.abs(i)>Math.abs(t)?i:t:"horizontal"===this.options.gestureOrientation&&(u=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||0===this.animatedScroll&&i>0||this.animatedScroll===this.limit&&i<0))&&(o.lenisStopPropagation=!0),o.cancelable&&o.preventDefault();let d=s&&this.options.syncTouch,m=s&&"touchend"===o.type;m&&(u=Math.sign(u)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+u,{programmatic:!1,...d?{lerp:m?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(!1===this.isScrolling||"native"===this.isScrolling){let e=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-e,this.direction=Math.sign(this.animatedScroll-e),this.isStopped||(this.isScrolling="native"),this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle)return void this.rootElement.style.removeProperty("overflow");this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle)return void this.rootElement.style.setProperty("overflow","clip");this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=e=>{let t=e-(this.time||e);this.time=e,this.animate.advance(.001*t),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(e,{offset:t=0,immediate:o=!1,lock:s=!1,programmatic:r=!0,lerp:n=r?this.options.lerp:void 0,duration:l=r?this.options.duration:void 0,easing:a=r?this.options.easing:void 0,onStart:h,onComplete:u,force:d=!1,userData:m}={}){if(this.prefersReducedMotion&&(r?o=!0:(n=1,l=void 0,a=void 0)),(this.isStopped||this.isLocked)&&!d)return;let p=e,f=t;if("string"==typeof p&&["top","left","start","#"].includes(p))p=0;else if("string"==typeof p&&["bottom","right","end"].includes(p))p=this.limit;else{let e=null;if("string"==typeof p?(e=p.startsWith("#")?document.getElementById(p.slice(1)):document.querySelector(p))||("#top"===p?p=0:console.warn("Lenis: Target not found",p)):p instanceof Element&&(e=p),e){if(this.options.wrapper!==window){let e=this.rootElement.getBoundingClientRect();f-=this.isHorizontal?e.left:e.top}let t=e.getBoundingClientRect(),i=getComputedStyle(e),o=this.isHorizontal?Number.parseFloat(i.scrollMarginLeft):Number.parseFloat(i.scrollMarginTop),s=getComputedStyle(this.rootElement),r=this.isHorizontal?Number.parseFloat(s.scrollPaddingLeft):Number.parseFloat(s.scrollPaddingTop);p=(this.isHorizontal?t.left:t.top)+this.animatedScroll-(Number.isNaN(o)?0:o)-(Number.isNaN(r)?0:r)}}if("number"==typeof p){if(p+=f,this.options.infinite){if(r){this.targetScroll=this.animatedScroll=this.scroll;let e=p-this.animatedScroll;e>this.limit/2?p-=this.limit:e<-this.limit/2&&(p+=this.limit)}}else p=i(0,p,this.limit);if(p===this.targetScroll){h?.(this),u?.(this);return}if(this.userData=m??{},o){this.animatedScroll=this.targetScroll=p,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}r||(this.targetScroll=p),"number"==typeof l&&"function"!=typeof a?a=c:"function"==typeof a&&"number"!=typeof l&&(l=1),this.animate.fromTo(this.animatedScroll,p,{duration:l,easing:a,lerp:n,onStart:()=>{s&&(this.isLocked=!0),this.isScrolling="smooth",h?.(this)},onUpdate:(e,t)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=e-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=e,this.setScroll(this.scroll),r&&(this.targetScroll=e),t||this.emit(),t&&(this.reset(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(e,{deltaX:t,deltaY:i}){let o,s,r,n,l,a,h,c,u,d,m,p,f,v,g,w,S=Date.now();e._lenis||(e._lenis={});let y=e._lenis;if(S-(y.time??0)>2e3){y.time=Date.now();let t=window.getComputedStyle(e);if(y.computedStyle=t,o=["auto","overlay","scroll"].includes(t.overflowX),s=["auto","overlay","scroll"].includes(t.overflowY),l=["auto"].includes(t.overscrollBehaviorX),a=["auto"].includes(t.overscrollBehaviorY),y.hasOverflowX=o,y.hasOverflowY=s,!(o||s))return!1;h=e.scrollWidth,c=e.scrollHeight,u=e.clientWidth,d=e.clientHeight,r=h>u,n=c>d,y.isScrollableX=r,y.isScrollableY=n,y.scrollWidth=h,y.scrollHeight=c,y.clientWidth=u,y.clientHeight=d,y.hasOverscrollBehaviorX=l,y.hasOverscrollBehaviorY=a}else r=y.isScrollableX,n=y.isScrollableY,o=y.hasOverflowX,s=y.hasOverflowY,h=y.scrollWidth,c=y.scrollHeight,u=y.clientWidth,d=y.clientHeight,l=y.hasOverscrollBehaviorX,a=y.hasOverscrollBehaviorY;if(!(o&&r||s&&n))return!1;let E=Math.abs(t)>=Math.abs(i)?"horizontal":"vertical";if("horizontal"===E)m=Math.round(e.scrollLeft),p=h-u,f=t,v=o,g=r,w=l;else{if("vertical"!==E)return!1;m=Math.round(e.scrollTop),p=c-d,f=i,v=s,g=n,w=a}return!w&&(m>=p||m<=0)||(f>0?m<p:m>0)&&v&&g}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){var e;return this.options.infinite?(this.animatedScroll%(e=this.limit)+e)%e:this.animatedScroll}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let e="lenis";return this.options.autoToggle&&(e+=" lenis-autoToggle"),this.isStopped&&(e+=" lenis-stopped"),this.isLocked&&(e+=" lenis-locked"),this.isScrolling&&(e+=" lenis-scrolling"),"smooth"===this.isScrolling&&(e+=" lenis-smooth"),e}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(e=>{this.rootElement.classList.add(e)})}cleanUpClassName(){for(let e of Array.from(this.rootElement.classList))("lenis"===e||e.startsWith("lenis-"))&&this.rootElement.classList.remove(e)}},d=e.i(18566),m=e.i(71645);let p="bf:scroll-lock",f="bf:scroll-unlock";e.s(["SCROLL_LOCK_EVENT",0,p,"SCROLL_UNLOCK_EVENT",0,f,"SmoothScroll",0,function(){let e=(0,m.useRef)(null),t=(0,d.usePathname)();return(0,m.useEffect)(()=>{e.current?.scrollTo(0,{immediate:!0,force:!0})},[t]),(0,m.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=new u({lerp:.09,anchors:!0});e.current=t;let i=requestAnimationFrame(function e(o){t.raf(o),i=requestAnimationFrame(e)}),o=()=>t.stop(),s=()=>t.start();return window.addEventListener(p,o),window.addEventListener(f,s),()=>{cancelAnimationFrame(i),window.removeEventListener(p,o),window.removeEventListener(f,s),t.destroy(),e.current=null}},[]),null}],21131)}]);