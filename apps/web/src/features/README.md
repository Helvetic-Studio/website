# Features

Put product capabilities in one folder per feature. Features may import shared and server code, but never another feature. Compose multiple features in the `app` layer.

Create only the subdirectories a feature needs and prefer direct imports over feature barrel files. See [Application architecture](../../../../docs/agents/architecture.md) for placement, testing, data-access, and error-handling guidance.
