-- AIMatch Pro Seed Data: Skills
-- Initial skills for AI/ML engineers

-- Programming Languages
INSERT INTO skills (name, category) VALUES
  ('Python', 'language'),
  ('JavaScript', 'language'),
  ('TypeScript', 'language'),
  ('Go', 'language'),
  ('Rust', 'language'),
  ('Java', 'language'),
  ('C++', 'language'),
  ('R', 'language'),
  ('Julia', 'language'),
  ('Scala', 'language')
ON CONFLICT (name) DO NOTHING;

-- ML/AI Frameworks
INSERT INTO skills (name, category) VALUES
  ('PyTorch', 'framework'),
  ('TensorFlow', 'framework'),
  ('Keras', 'framework'),
  ('scikit-learn', 'framework'),
  ('JAX', 'framework'),
  ('Hugging Face Transformers', 'framework'),
  ('LangChain', 'framework'),
  ('LlamaIndex', 'framework'),
  ('OpenCV', 'framework'),
  ('FastAPI', 'framework'),
  ('Django', 'framework'),
  ('Flask', 'framework'),
  ('Next.js', 'framework'),
  ('React', 'framework'),
  ('Vue.js', 'framework')
ON CONFLICT (name) DO NOTHING;

-- ML/AI Skills
INSERT INTO skills (name, category) VALUES
  ('機械学習', 'ml'),
  ('深層学習', 'ml'),
  ('自然言語処理', 'ml'),
  ('コンピュータビジョン', 'ml'),
  ('強化学習', 'ml'),
  ('推薦システム', 'ml'),
  ('時系列予測', 'ml'),
  ('異常検知', 'ml'),
  ('音声認識', 'ml'),
  ('画像生成', 'ml')
ON CONFLICT (name) DO NOTHING;

-- GenAI Skills
INSERT INTO skills (name, category) VALUES
  ('LLM', 'genai'),
  ('GPT', 'genai'),
  ('Claude', 'genai'),
  ('Gemini', 'genai'),
  ('RAG', 'genai'),
  ('プロンプトエンジニアリング', 'genai'),
  ('Fine-tuning', 'genai'),
  ('Embeddings', 'genai'),
  ('Vector Database', 'genai'),
  ('AI Agent', 'genai'),
  ('Stable Diffusion', 'genai'),
  ('Midjourney', 'genai'),
  ('DALL-E', 'genai')
ON CONFLICT (name) DO NOTHING;

-- Infrastructure/MLOps
INSERT INTO skills (name, category) VALUES
  ('AWS', 'infra'),
  ('GCP', 'infra'),
  ('Azure', 'infra'),
  ('Docker', 'infra'),
  ('Kubernetes', 'infra'),
  ('MLflow', 'infra'),
  ('Kubeflow', 'infra'),
  ('Airflow', 'infra'),
  ('Terraform', 'infra'),
  ('CI/CD', 'infra'),
  ('MLOps', 'infra'),
  ('データパイプライン', 'infra')
ON CONFLICT (name) DO NOTHING;

-- Data Skills
INSERT INTO skills (name, category) VALUES
  ('SQL', 'data'),
  ('PostgreSQL', 'data'),
  ('MongoDB', 'data'),
  ('BigQuery', 'data'),
  ('Snowflake', 'data'),
  ('Spark', 'data'),
  ('Pandas', 'data'),
  ('NumPy', 'data'),
  ('データ分析', 'data'),
  ('データ可視化', 'data'),
  ('ETL', 'data'),
  ('dbt', 'data')
ON CONFLICT (name) DO NOTHING;
