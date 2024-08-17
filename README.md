# Ideocracy
A knowledge-sharing platform dedicated to identifying societal problems and developing political community-based solutions.

# Development server
Run ng serve for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.


# Build
Run ng build to build the project. The build artifacts will be stored in the dist/ directory.



### File Naming postfix notation

Depending on the type of file, the postfix before the extention should be as follows;

| Type        | File Name              | Reference Name     |
| ----------- | ---------------------- | ------------------ |
| Model       | `person.model.ts`      | Person             |
| Service     | `search.service.ts`    | SearchService      |
| Component   | `display.component.ts` | DisplayComponent   |
| Enum        | `lockState.enum.ts`    | LockStateEnum      |
| Api Service | `name.api.service.ts`  | NameApiService     |
| Api Model   | `name.api.model.ts`    | NameApi            |



### Directory Structure

The following top-level folder structure is used to organize our Angular repo.

```javascript
src/app
    |
    └── Api // contains all api related models, services, etc
    |
    └── Common // shared modules used across various parts of the app
    |
    └── Core // application-wide singleton services & components
    |
    └── Features // major feature modules, usually representing a major route
```


### Directory Naming Convention
  
The below folders follow <ins>Pascal case</ins>.
- Module
- Component
- Parent module


Direct child folders within a Module folder are <ins>lowercase</ins> and all files are <ins>hyphenated lower-case</ins>. Eg.

```
Common
   └─ Dialogs
        |
        └── components
        |        └─ AssingDialog
        |               └── assign-dialog.component.ts
        |               └── assign-dialog.component.html
        |               └── assign-dialog.component.scss
        |
        └── enums
        |     └─ upsert-action.enum.ts
        |
        └── services
        |
        └ dialogs.module.ts
```
