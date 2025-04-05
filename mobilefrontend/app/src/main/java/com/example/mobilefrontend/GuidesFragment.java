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
import java.util.ArrayList;
import java.util.List;

public class GuidesFragment extends Fragment {
    private RecyclerView recyclerView;
    private TextView emptyTextView;
    private ProgressBar progressBar;
    private GuideAdapter adapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        Log.d("GuidesFragment", "onCreateView started");
        View view = inflater.inflate(R.layout.fragment_list, container, false);
        recyclerView = view.findViewById(R.id.recyclerView);
        emptyTextView = view.findViewById(R.id.emptyTextView);
        progressBar = view.findViewById(R.id.progressBar);

        if (recyclerView == null) {
            Log.e("GuidesFragment", "RecyclerView is null");
            return view;
        }
        if (emptyTextView == null) {
            Log.e("GuidesFragment", "EmptyTextView is null");
            return view;
        }
        if (progressBar == null) {
            Log.e("GuidesFragment", "ProgressBar is null");
            return view;
        }

        Log.d("GuidesFragment", "Setting up RecyclerView");
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new GuideAdapter(new ArrayList<>(), getParentFragmentManager());
        recyclerView.setAdapter(adapter);

        Log.d("GuidesFragment", "Loading guides");
        loadGuides();
        Log.d("GuidesFragment", "onCreateView finished");
        return view;
    }

    private void loadGuides() {
        new Thread(() -> {
            try {
                Log.d("GuidesFragment", "Fetching guides from API");
                ApiClient apiClient = new ApiClient();
                String response = apiClient.getGuides();
                Log.d("GuidesFragment", "API Response: " + response);
                Gson gson = new Gson();
                List<Guide> guides = gson.fromJson(response, new TypeToken<List<Guide>>(){}.getType());
                if (guides == null) {
                    Log.e("GuidesFragment", "Parsed guides list is null");
                    guides = new ArrayList<>();
                }
                for (Guide guide : guides) {
                    if (guide == null) {
                        Log.e("GuidesFragment", "Found null Guide in parsed list");
                    } else {
                        Log.d("GuidesFragment", "Guide: id=" + guide.getId() + ", title=" + guide.getTitle() + ", description=" + guide.getDescription());
                    }
                }
                List<Guide> finalGuides = guides;
                getActivity().runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    if (finalGuides.isEmpty()) {
                        Log.d("GuidesFragment", "No guides available");
                        recyclerView.setVisibility(View.GONE);
                        emptyTextView.setVisibility(View.VISIBLE);
                        emptyTextView.setText("No guides available");
                    } else {
                        Log.d("GuidesFragment", "Setting guides in adapter");
                        adapter.setGuides(finalGuides);
                        recyclerView.setVisibility(View.VISIBLE);
                        emptyTextView.setVisibility(View.GONE);
                    }
                });
            } catch (Exception e) { // Changed from IOException to Exception
                e.printStackTrace();
                Log.e("GuidesFragment", "Error loading guides: " + e.getMessage());
                getActivity().runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    recyclerView.setVisibility(View.GONE);
                    emptyTextView.setVisibility(View.VISIBLE);
                    emptyTextView.setText("Error loading guides: " + e.getMessage());
                });
            }
        }).start();
    }
}

class GuideAdapter extends RecyclerView.Adapter<GuideAdapter.GuideViewHolder> {
    private List<Guide> guides;
    private FragmentManager fragmentManager;

    public GuideAdapter(List<Guide> guides, FragmentManager fragmentManager) {
        this.guides = guides != null ? guides : new ArrayList<>();
        this.fragmentManager = fragmentManager;
        Log.d("GuideAdapter", "Adapter initialized with " + this.guides.size() + " items");
    }

    public void setGuides(List<Guide> guides) {
        this.guides = guides != null ? guides : new ArrayList<>();
        Log.d("GuideAdapter", "setGuides called with " + this.guides.size() + " items: " + this.guides.toString());
        notifyDataSetChanged();
    }

    @Override
    public GuideViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        Log.d("GuideAdapter", "onCreateViewHolder called");
        View view = LayoutInflater.from(parent.getContext())
                .inflate(android.R.layout.simple_list_item_1, parent, false);
        return new GuideViewHolder(view);
    }

    @Override
    public void onBindViewHolder(GuideViewHolder holder, int position) {
        Log.d("GuideAdapter", "onBindViewHolder called for position " + position);
        Guide guide = guides.get(position);
        if (guide == null) {
            Log.e("GuideAdapter", "Guide at position " + position + " is null");
            holder.textView.setText("Error: Guide not available");
            return;
        }
        String title = guide.getTitle() != null ? guide.getTitle() : "No Title";
        holder.textView.setText(title);
        holder.itemView.setOnClickListener(v -> {
            if (fragmentManager == null) {
                Log.e("GuideAdapter", "FragmentManager is null");
                return;
            }
            Log.d("GuideAdapter", "Guide clicked at position " + position + ": " + title);
            String description = guide.getDescription() != null ? guide.getDescription() : "No Description";
            DetailFragment detailFragment = DetailFragment.newInstance(title, description);
            fragmentManager
                    .beginTransaction()
                    .replace(R.id.fragment_container, detailFragment)
                    .addToBackStack(null)
                    .commit();
        });
    }

    @Override
    public int getItemCount() {
        int count = guides.size();
        Log.d("GuideAdapter", "getItemCount: " + count);
        return count;
    }

    static class GuideViewHolder extends RecyclerView.ViewHolder {
        TextView textView;

        GuideViewHolder(View itemView) {
            super(itemView);
            textView = itemView.findViewById(android.R.id.text1);
            Log.d("GuideAdapter", "GuideViewHolder created, textView: " + (textView != null));
        }
    }
}