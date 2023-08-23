

# Modifying GitLab source

```sh

sed -E -i.bk 's/\/(16.0\/)/\/gitlab\/\1/g' */**/*.html
sed -E -i.bk 's/\/(16.0\/)/\/gitlab\/\1/g' */**/*.js
sed -E -i.bk 's/\/(16.0\/)/\/gitlab\/\1/g' */**/*.css
sed -E -i.bk 's/\/(16.0\/)/\/gitlab\/\1/g' **/*.{html,css,js}

sed -E -i.bk 's/\/(versions.json)/\/gitlab\/16.0\/\1/g' */**/default.js

find . -name '*.bk' -exec rm {} +;
```

# Setuptools

Follow the build steps from the setuptools repository off of
https://readthedocs.org/projects/setuptools/builds/21650071/

# ReadtheDocs

https://readthedocs.org/projects/$PKG/downloads/

