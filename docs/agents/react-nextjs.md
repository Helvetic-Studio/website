# React and Next.js conventions

Apply these conventions when changing React components, Next.js routes, or browser-facing behavior.

## React

- Use function components.
- Keep hooks at the top level and specify their complete dependency lists.
- Use stable domain identifiers as iterable keys; do not use array indexes when items can be reordered, inserted, or removed.
- Put children between component tags rather than passing a `children` prop explicitly.
- Define reusable components at module scope rather than inside another component.
- With React 19, accept `ref` as a prop instead of introducing `forwardRef`.

## Next.js

- Read the relevant documentation in `node_modules/next/dist/docs/` before relying on framework conventions or APIs.
- Use `next/image` for content images that benefit from Next.js image optimization.
- Use the App Router metadata API for document metadata.
- Fetch data in Server Components by default; add a Client Component only when browser APIs, event handling, or client-side state require one.

## Accessibility and browser safety

- Prefer semantic HTML elements and native interaction behavior over generic elements with ARIA roles.
- Give informative images meaningful alternative text and decorative images empty alternative text.
- Preserve a logical heading hierarchy and associate every form control with an accessible label.
- When opening an external link in a new tab, include `rel="noopener noreferrer"`.
- Avoid `dangerouslySetInnerHTML`; when it is necessary, sanitize the content at a trusted seam.
- Validate untrusted input before using it, and never use `eval()` or write directly to `document.cookie`.
