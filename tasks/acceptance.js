import gulp from 'gulp';
import promisify from 'es6-promisify';
// import npm from 'npm';
import runSequence from 'run-sequence';
import glob from 'glob';
import fs from 'fs';

import {getPackageInfo, publishFakePackages} from './helpers/publish-helper';

gulp.task('my-name-is-nic-i-do-acceptance', (done) =>
    runSequence(
      'clean-local',
      'release-update-version',
      'release-update-package-versions',
      'release-push-fake-npm-publish',
      done
    )
);

gulp.task('release-push-fake-npm-publish', ['css-build', 'react-build'], async () => {
  const files = glob.sync('dist/{css,react}/*/package.json', {realpath: true});
  const packageInfos = files.map((filepath) => {
    return {
      contents: fs.readFileSync(filepath),
      path: filepath
    };
  }).map(getPackageInfo);

  await publishFakePackages()(packageInfos);
});

gulp.task('clean-local', async () => {

  const cleanPromise = async function () {
    return await promisify(exec)(`npm cache clean`);
  };

  await cleanPromise();
});
