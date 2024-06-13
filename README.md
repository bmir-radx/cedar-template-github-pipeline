# cedar-template-github-pipeline
This pipeline generates the RADx Metadata Specification from Google Sheets and documents the specifications.

## Google Sheet
The Google Sheet for the CEDAR Template can be found [here](https://docs.google.com/spreadsheets/d/1Kwe4PFodciXo-XDX2bHN8F-CRAmopguoI9YKFX6piaQ/edit#gid=118145754).

## CEDAR Template in Repo
You can view the CEDAR Template JSON-LD file in the repository [here](https://github.com/yancao77/cedar_template_pipeline/blob/refs/heads/main/RADxMetadataSpecification.json).

## CEDAR Template in CEDAR
You can access the CEDAR Template on the CEDAR website [here](https://cedar.metadatacenter.org/dashboard?folderId=https:%2F%2Frepo.metadatacenter.org%2Ffolders%2F5ac6dcb6-7a9b-4a75-a945-60ae43750953).

## Documentation
The documentation for the CEDAR Template is available [here](https://radx.github.io/radx-metadata-specification-docs/specification)

## Workflow

This workflow is manually triggered and performs several tasks related to the RADx Metadata Specification, including downloading the Google Sheet as a CSV, committing the CSV to the repository, updating the README.md file, creating a GitHub release, and copying and protecting the Google Sheet.

### Triggering the Workflow

The workflow can be triggered manually with the following inputs:

- `google_spreadsheet_id`: (Optional) The ID of the Google Spreadsheet for the CEDAR Template. Default is `1Kwe4PFodciXo-XDX2bHN8F-CRAmopguoI9YKFX6piaQ`.
- `google_sheet_id`: (Required) The tab ID of the Google Sheet for the CEDAR Template.
- `template_folder_id`: (Required) The Template Folder ID in CEDAR.
- `release_tag`: (Optional) The tag name for the release. If a release tag is provided, a GitHub release will be created to tag the specific version of the Google Sheet, the CEDAR template in the repository, the CEDAR template in CEDAR, and the documentation.

### Example

To trigger the workflow manually, you can use the following example inputs:
```
gh workflow run "CEDAR Template GitHub Pipeline" --ref main \
-f google_sheet_id="802588906" \
-f template_folder_id="https:%2F%2Frepo.metadatacenter.org%2Ffolders%2F5ac6dcb6-7a9b-4a75-a945-60ae43750953" \
-f release_tag="v1.0.0"
```

## Details about this pipeline
[CEDAR Template GitHub Pipeline](https://docs.google.com/document/d/1m-mdUK8g7WbBKOnFft5464Tmk-MSxTh1LHEL7bpf9pA/edit)
