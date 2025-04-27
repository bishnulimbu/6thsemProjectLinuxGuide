# Weekly Progress Report - Week 4

**Student Name:** [Bishnu Limbu](https://github.com/bishnulimbu)
**Week Number:** 4  
**Report Duration:** From: 2025-04-14 To: 2025-04-20  
**Report Submission Date:** 2025-04-20

| Task Completed | Code/Features Implemented          | Short Explanation                                                                          | GitHub Link to PR/Commit                                                                                 |
| -------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Search UI      | Added search page in React         | Created a `Search.tsx` component with a search bar, debounced search, and results display. | [https://github.com/bishnulimbu/6thsemProjectLinuxGuide/commit/a7603958c76e31a8b1cee119745066f5797c22dd] |
| Tag Search     | Extended `/search` to include tags | Modified the search endpoint to include tags for both guides and posts.                    | [https://github.com/bishnulimbu/6thsemProjectLinuxGuide/commit/8ef9ec64a43a0697213ae2786d1a3a62de870138] |

**Completed on Time?**  
Yes

**Challenges Faced:**

- Debouncing the search input with `lodash` required understanding `useCallback` to prevent re-renders.
- Sequelize associations for tags were not returning data as expected due to incorrect `include` syntax.

**What I Learned:**

- How to implement debounced search in React to optimize API calls.
- Sequelize `include` for many-to-many relationships and filtering with `where` clauses.

**Plan for Next Week:**

| Task Description                         | Estimated Completion Time |
| ---------------------------------------- | ------------------------- |
| Modify search to exclude tags for guides | 2 days                    |
| Add tag display in search results UI     | 2 days                    |
