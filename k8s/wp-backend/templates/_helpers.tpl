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

{{- define "wellplay.db.fullname" -}}
{{- $name := .Chart.Name }}
{{- if contains $name .Release.Name }}
{{- printf "%s-%s" "db" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s-%s" "db" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{- define "wellplay.redis.fullname" -}}
{{- $name := .Chart.Name }}
{{- if contains $name .Release.Name }}
{{- printf "%s-%s" "redis" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s-%s" "redis" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{- define "wellplay.celery.fullname" -}}
{{- $name := .Chart.Name }}
{{- if contains $name .Release.Name }}
{{- printf "%s-%s" "celery" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s-%s" "celery" .Release.Name $name | trunc 63 | trimSuffix "-" }}
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
tier: backend
{{- end -}}

{{- define "db.selectorLabels" -}}
app: db
component: postgresql
{{- end -}}

{{- define "redis.selectorLabels" -}}
app: db
component: redis
{{- end -}}

{{- define "celery.selectorLabels" -}}
app: db
component: celery
{{- end -}}
