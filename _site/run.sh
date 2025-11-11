bundle install
bundle exec jekyll build

git config --global user.email "jinhankim@kaist.ac.kr"
git config --global user.name "jinhankim"  

git add .
git commit -m "."
git push origin main