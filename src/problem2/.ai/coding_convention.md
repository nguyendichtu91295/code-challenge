
## Folder structure

```text
src/
  features/posts/
    FeedPage.tsx
    components/
      CreatePostForm.tsx
      CreatePostDialog.tsx
      FloatingFeedActions.tsx
      PostList.tsx
      PostCard.tsx
    hooks/
      usePosts.ts
      useCreatePost.ts
      useInfiniteScroll.ts
      useFeedNavigation.ts
    posts.api.ts
    posts.types.ts
    posts.validation.ts
    posts.mock.ts
  App.tsx
  styles.css
```

## Coding conventions

- Prefer small components split by responsibility. Extract a component when it has a clear responsibility, is reusable, or makes its parent easier to read; avoid splitting tiny markup unnecessarily.
- Separate stateful behavior into focused hooks:
  - `usePosts` owns the post list, pagination cursor, initial and next-page loading/errors, retrying, deduplication, and adding successfully created posts.
  - `useCreatePost` handles submission, pending state, and submission errors.
  - `useInfiniteScroll` owns observer setup and cleanup and signals when to load more; it does not own a second post list or fetch data itself.
  - `useFeedNavigation` handles top-of-feed visibility, the new-post indicator, and scrolling to the top. It does not own another copy of the posts.
  - Keep simple textarea state inside `CreatePostForm` unless its logic grows enough to justify a separate hook.
- Keep mock API calls in `posts.api.ts` and seed data in `posts.mock.ts`. Components use hooks instead of calling the mock service directly. Use `setTimeout` to simulate network latency.
- Give each state one owner. After successful creation, `CreatePostForm` passes the returned post through `onCreated(post)` so the feed can update its list. Do not duplicate the post list across hooks or components.
- Use local state and explicit props for this scope.
- Define explicit types such as `Post`, `CreatePostInput`, and `CreatePostFormProps`; avoid `any`.
- Use PascalCase for component names and filenames, `useSomething` for hooks, `handleSubmit`-style names for event handlers, and `onCreated`-style names for callback props.
- Keep validation in a pure function in `posts.validation.ts`, using a shared `MAX_POST_LENGTH = 200` constant. Reject empty or whitespace-only descriptions and descriptions longer than 200 characters; allow exactly 200 characters.
- Show feed errors with a Retry action. Show submission errors beside the form and preserve the draft on failure. Disable submission while a request is pending.
- Add a created post to the top of the feed after the mock request succeeds.
