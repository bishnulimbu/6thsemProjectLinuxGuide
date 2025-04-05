package com.example.mobilefrontend;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.fragment.app.Fragment;
import io.noties.markwon.Markwon;
// Ensure this import is correct

public class DetailFragment extends Fragment {
    private static final String ARG_TITLE = "title";
    private static final String ARG_CONTENT = "content";

    public static DetailFragment newInstance(String title, String content) {
        DetailFragment fragment = new DetailFragment();
        Bundle args = new Bundle();
        args.putString(ARG_TITLE, title);
        args.putString(ARG_CONTENT, content);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_detail, container, false);

        TextView titleTextView = view.findViewById(R.id.detailTitleTextView);
        TextView contentTextView = view.findViewById(R.id.detailContentTextView);

        if (titleTextView == null || contentTextView == null) {
            throw new IllegalStateException("Title or content TextView not found in fragment_detail layout");
        }

        // Initialize Markwon for rendering Markdown
        try {
            Markwon markwon = Markwon.create(getContext());
            if (getArguments() != null) {
                String title = getArguments().getString(ARG_TITLE);
                String content = getArguments().getString(ARG_CONTENT);
                titleTextView.setText(title != null ? title : getString(R.string.no_title));
                if (content != null) {
                    // Parse and render Markdown content
                    markwon.setMarkdown(contentTextView, content);
                } else {
                    contentTextView.setText(getString(R.string.no_content));
                }
            } else {
                titleTextView.setText(getString(R.string.no_title));
                contentTextView.setText(getString(R.string.no_content));
            }
        } catch (Exception e) {
            // Fallback in case Markwon fails to initialize
            e.printStackTrace();
            if (getArguments() != null) {
                String title = getArguments().getString(ARG_TITLE);
                String content = getArguments().getString(ARG_CONTENT);
                titleTextView.setText(title != null ? title : getString(R.string.no_title));
                contentTextView.setText(content != null ? content : getString(R.string.no_content));
            } else {
                titleTextView.setText(getString(R.string.no_title));
                contentTextView.setText(getString(R.string.no_content));
            }
        }

        return view;
    }
}