#!/bin/bash

startDir=${1:-"."}

cd ${startDir} || exit 3

classDir=classes

files=$(find . -type f -name \*java)

\rm -rf ${classDir}
javac -d ${classDir} ${files}
retVal=$?

if [ "${retVal}" != 0 ]
then
    echo "ERROR: Failed to compile all java files."
    exit 1
fi



#
#    Find the files that have a 'main()' method...
#
find . -type f -name \*.java -exec grep -l "  *main *( *String" {} /dev/null \; | while read f
do
    # get the package statement...
    package=$(grep "^package  *" ${f})

    jFile=$(basename $f)
    find classes -type f -name ${jFile/.java}.class | sed "s|classes/||g" | sed "s|.class$||g" | sed 's/^/java -cp classes /g'
done

exit 0
