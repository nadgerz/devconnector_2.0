#!/bin/sh

echo "RUN /Users/si/bin/addGitIgnore.sh"

#
#    Re-generate .gitignore files from core ones.  Makes updates easier.
#
#    NOTE: local-project.gitignore should always come last.
#
myname=$(basename $0)

#
#    Pretend to run from where this script is.
#
cd $(dirname $0)


#
#    In case it does not exist...
#
touch local-project.gitignore
mkdir -p Global

# set -x

ignoreFiles="Global/Ansible.gitignore Global/Vagrant.gitignore Global/Vim.gitignore Global/VisualStudioCode.gitignore Global/macOS.gitignore Global/JetBrains.gitignore Sass.gitignore Rust.gitignore Swift.gitignore Go.gitignore Dart.gitignore Node.gitignore Kotlin.gitignore Java.gitignore"

for i in ${ignoreFiles}
do
    echo Adding ignore file for: ${i}...
    # TBD - change hard-code to github repo
    if [ ! -f "/tools/github/gitignore/${i}" ]
    then
        echo "ERROR: Unable to find .gitignore file >${i}<"
        exit 1
    else
        addGitIgnore.sh "$i" | tail -1 | grep "${i}" | while read f
        do
            \cp -f "${f}" "${i}"
        done
    fi
done

for i in ${ignoreFiles}
do
    echo "# --- IGNORE FILE --- ${i} ..."
    cat ${i}
done > ../../.gitignore

echo Adding local ignore file...
cat local-project.gitignore >> ../../.gitignore

echo "Adding ignore ebtries for files > 2 MB"
find . -type f -size +2M >> ../../.gitignore

#
#    What is the status
#
git status

#
#    We're done!
#
exit 0
