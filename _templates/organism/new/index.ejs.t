---
to: src/organisms/<%=name%>/index.tsx
---
import <%= h.changeCase.ucFirst(name) %> from './<%= h.changeCase.ucFirst(name) %>';

export default <%= h.changeCase.ucFirst(name) %>;
