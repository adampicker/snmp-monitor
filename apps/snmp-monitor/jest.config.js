module.exports = {
  name: 'snmp-monitor',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/snmp-monitor',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
