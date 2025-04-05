package com.example.mobilefrontend;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PostsFragment extends Fragment {
    private RecyclerView recyclerView;
    private TextView emptyTextView;
    private ProgressBar progressBar;
    private PostAdapter adapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        Log.d("PostsFragment", "onCreateView started");
        View view = inflater.inflate(R.layout.fragment_list, container, false);
        recyclerView = view.findViewById(R.id.recyclerView);
        emptyTextView = view.findViewById(R.id.emptyTextView);
        progressBar = view.findViewById(R.id.progressBar);

        if (recyclerView == null) {
            Log.e("PostsFragment", "RecyclerView is null");
            return view;
        }
        if (emptyTextView == null) {
            Log.e("PostsFragment", "EmptyTextView is null");
            return view;
        }
        if (progressBar == null) {
            Log.e("PostsFragment", "ProgressBar is null");
            return view;
        }

        Log.d("PostsFragment", "Setting up RecyclerView");
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new PostAdapter(new ArrayList<>(), getParentFragmentManager());
        recyclerView.setAdapter(adapter);

        Log.d("PostsFragment", "Loading posts");
        loadPosts();
        Log.d("PostsFragment", "onCreateView finished");
        return view;
    }

    private void loadPosts() {
        new Thread(() -> {
            try {
                Log.d("PostsFragment", "Fetching posts from API");
                ApiClient apiClient = new ApiClient();
                String response = apiClient.getPosts();
                Log.d("PostsFragment", "API Response: " + response);
                Gson gson = new Gson();
                List<Post> posts = gson.fromJson(response, new TypeToken<List<Post>>(){}.getType());
                if (posts == null) {
                    Log.e("PostsFragment", "Parsed posts list is null");
                    posts = new ArrayList<>();
                }
                for (Post post : posts) {
                    if (post == null) {
                        Log.e("PostsFragment", "Found null Post in parsed list");
                    } else {
                        Log.d("PostsFragment", "Post: id=" + post.getId() + ", title=" + post.getTitle() + ", content=" + post.getContent());
                    }
                }
                List<Post> finalPosts = posts;
                getActivity().runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    if (finalPosts.isEmpty()) {
                        Log.d("PostsFragment", "No posts available");
                        recyclerView.setVisibility(View.GONE);
                        emptyTextView.setVisibility(View.VISIBLE);
                        emptyTextView.setText("No posts available");
                    } else {
                        Log.d("PostsFragment", "Setting posts in adapter");
                        adapter.setPosts(finalPosts);
                        recyclerView.setVisibility(View.VISIBLE);
                        emptyTextView.setVisibility(View.GONE);
                    }
                });
            } catch (Exception e) { // Changed from IOException to Exception
                e.printStackTrace();
                Log.e("PostsFragment", "Error loading posts: " + e.getMessage());
                getActivity().runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    recyclerView.setVisibility(View.GONE);
                    emptyTextView.setVisibility(View.VISIBLE);
                    emptyTextView.setText("Error loading posts: " + e.getMessage());
                });
            }
        }).start();
    }
}

class PostAdapter extends RecyclerView.Adapter<PostAdapter.PostViewHolder> {
    private List<Post> posts;
    private FragmentManager fragmentManager;

    public PostAdapter(List<Post> posts, FragmentManager fragmentManager) {
        this.posts = posts != null ? posts : new ArrayList<>();
        this.fragmentManager = fragmentManager;
        Log.d("PostAdapter", "Adapter initialized with " + this.posts.size() + " items");
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts != null ? posts : new ArrayList<>();
        Log.d("PostAdapter", "setPosts called with " + this.posts.size() + " items: " + this.posts.toString());
        notifyDataSetChanged();
    }

    @Override
    public PostViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        Log.d("PostAdapter", "onCreateViewHolder called");
        View view = LayoutInflater.from(parent.getContext())
                .inflate(android.R.layout.simple_list_item_1, parent, false);
        return new PostViewHolder(view);
    }

    @Override
    public void onBindViewHolder(PostViewHolder holder, int position) {
        Log.d("PostAdapter", "onBindViewHolder called for position " + position);
        Post post = posts.get(position);
        if (post == null) {
            Log.e("PostAdapter", "Post at position " + position + " is null");
            holder.textView.setText("Error: Post not available");
            return;
        }
        String title = post.getTitle() != null ? post.getTitle() : "No Title";
        holder.textView.setText(title);
        holder.itemView.setOnClickListener(v -> {
            if (fragmentManager == null) {
                Log.e("PostAdapter", "FragmentManager is null");
                return;
            }
            Log.d("PostAdapter", "Post clicked at position " + position + ": " + title);
            String content = post.getContent() != null ? post.getContent() : "No Content";
            DetailFragment detailFragment = DetailFragment.newInstance(title, content);
            fragmentManager
                    .beginTransaction()
                    .replace(R.id.fragment_container, detailFragment)
                    .addToBackStack(null)
                    .commit();
        });
    }

    @Override
    public int getItemCount() {
        int count = posts.size();
        Log.d("PostAdapter", "getItemCount: " + count);
        return count;
    }

    static class PostViewHolder extends RecyclerView.ViewHolder {
        TextView textView;

        PostViewHolder(View itemView) {
            super(itemView);
            textView = itemView.findViewById(android.R.id.text1);
            Log.d("PostAdapter", "PostViewHolder created, textView: " + (textView != null));
        }
    }
}