{{- define "wellplay.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "wellplay.labels" -}}
{{ include "wellplay.selectorLabels" .}}
app.kubernetes.io/version: "{{ .Values.image.tag | default .Chart.AppVersion }}"
app.kubernetes.io/managed-by: helm
{{- end -}}

{{- define "wellplay.selectorLabels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
release: {{ .Release.Name }}
{{- end -}}
