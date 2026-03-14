-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL CHECK (category IN ('Arrays', 'Trees', 'Graphs', 'Dynamic Programming')),
  solution TEXT,
  starter_code TEXT,
  hints TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can read questions" ON public.questions FOR SELECT TO authenticated USING (true);

-- Practice history
CREATE TABLE public.practice_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  user_answer TEXT,
  is_correct BOOLEAN DEFAULT false,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.practice_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own history" ON public.practice_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.practice_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bookmarks
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Interview sessions
CREATE TABLE public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON public.interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed some questions
INSERT INTO public.questions (title, description, difficulty, category, solution, starter_code) VALUES
('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'Easy', 'Arrays', 'Use a hash map to store complements. For each number, check if target - num exists in the map.', 'function twoSum(nums, target) {\n  // Your code here\n}'),
('Valid Parentheses', 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.', 'Easy', 'Arrays', 'Use a stack. Push opening brackets and pop when closing brackets match.', 'function isValid(s) {\n  // Your code here\n}'),
('Binary Tree Inorder Traversal', 'Given the root of a binary tree, return the inorder traversal of its nodes'' values.', 'Easy', 'Trees', 'Use recursion: traverse left subtree, visit node, traverse right subtree.', 'function inorderTraversal(root) {\n  // Your code here\n}'),
('Maximum Depth of Binary Tree', 'Given the root of a binary tree, return its maximum depth.', 'Easy', 'Trees', 'Recursively find max depth: 1 + max(depth(left), depth(right)).', 'function maxDepth(root) {\n  // Your code here\n}'),
('Number of Islands', 'Given an m x n 2D binary grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands.', 'Medium', 'Graphs', 'Use BFS/DFS. For each ''1'', mark all connected ''1''s as visited and increment count.', 'function numIslands(grid) {\n  // Your code here\n}'),
('Clone Graph', 'Given a reference of a node in a connected undirected graph, return a deep copy of the graph.', 'Medium', 'Graphs', 'Use BFS/DFS with a hash map to track cloned nodes.', 'function cloneGraph(node) {\n  // Your code here\n}'),
('Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?', 'Easy', 'Dynamic Programming', 'This is essentially Fibonacci. dp[i] = dp[i-1] + dp[i-2].', 'function climbStairs(n) {\n  // Your code here\n}'),
('Longest Increasing Subsequence', 'Given an integer array nums, return the length of the longest strictly increasing subsequence.', 'Medium', 'Dynamic Programming', 'Use DP where dp[i] is the length of LIS ending at index i. For each i, check all j < i.', 'function lengthOfLIS(nums) {\n  // Your code here\n}'),
('Merge k Sorted Lists', 'You are given an array of k linked-lists, each sorted in ascending order. Merge all lists into one sorted linked-list.', 'Hard', 'Arrays', 'Use a min-heap (priority queue) to efficiently merge lists.', 'function mergeKLists(lists) {\n  // Your code here\n}'),
('Serialize and Deserialize Binary Tree', 'Design an algorithm to serialize and deserialize a binary tree.', 'Hard', 'Trees', 'Use BFS with level-order traversal for serialization. Use a queue for deserialization.', 'function serialize(root) {\n  // Your code here\n}\nfunction deserialize(data) {\n  // Your code here\n}'),
('Word Break', 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into space-separated sequence of dictionary words.', 'Medium', 'Dynamic Programming', 'Use DP. dp[i] is true if s[0..i-1] can be segmented. Check all possible breaks.', 'function wordBreak(s, wordDict) {\n  // Your code here\n}'),
('Course Schedule', 'There are a total of numCourses courses you have to take. Some courses have prerequisites. Determine if you can finish all courses.', 'Medium', 'Graphs', 'Use topological sort with DFS. Detect cycles in the directed graph.', 'function canFinish(numCourses, prerequisites) {\n  // Your code here\n}');
