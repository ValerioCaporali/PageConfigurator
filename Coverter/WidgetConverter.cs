// using System;
// using System.Text.Json;
// using System.Text.Json.Serialization;
// using Model.PageModel;
// using Model.PageModel.PageWidget;
// using Model.PageModel.PageWidget.WidgetContent;

// namespace Converter 
// {
//     public class ContentConverter : JsonConverter<Widget>
//     {
//         public override bool CanConvert(Type typeToConvert) =>
//             typeof(Widget).IsAssignableFrom(typeToConvert);

//         public override Widget Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
//         {
//             Utf8JsonReader readerClone = reader;

//             if (readerClone.TokenType != JsonTokenType.StartObject)
//             {
//                 throw new JsonException();
//             }

//             readerClone.Read();
//             if (readerClone.TokenType != JsonTokenType.PropertyName)
//             {
//                 throw new JsonException();
//             }

//             string? propertyName = readerClone.GetString();
//             if (propertyName != "Type")
//             {
//                 throw new JsonException();
//             }

//             readerClone.Read();
//             if (readerClone.TokenType != JsonTokenType.Number)
//             {
//                 throw new JsonException();
//             }

//             WidgetType typeDiscriminator = (WidgetType)readerClone.GetInt32();
//             Widget widget = typeDiscriminator switch
//             {
//                 WidgetType.Text => new HtmlConfiguration(),
//                 WidgetType.Gallery => new GalleryConfiguration(),
//                 WidgetType.Video => new VideoConfiguration(),
//                 WidgetType.Pdf => new BaseMediaConfiguration(),
//                 WidgetType.Tour => new ShowcaseConfiguration(),
//                 WidgetType.Map => new MapConfiguration(),
//                 WidgetType.WebPage => new BaseMediaConfiguration(),
//                 WidgetType.HorizontalScrollGallery => new BaseMediaConfiguration(),
//                 WidgetType.GridGallery => new BaseMediaConfiguration(),
//                 _ => throw new JsonException()
//             };

//             if (readerClone.TokenType == JsonTokenType.EndObject)
//                 {
//                     return widget;
//                 }

//             while (readerClone.Read())
//             {
//                 if (reader.TokenType == JsonTokenType.PropertyName)
//                 {
//                     propertyName = readerClone.GetString();
//                     readerClone.Read();
//                     if (propertyName == "Content")
//                     {
//                         Content content = new Content();
//                         ((Content)widget).Content = content;
//                     }
//                 }
//             }

//             throw new JsonException();

//         }

//         public override void Write(Utf8JsonWriter writer, Widget widget, JsonSerializerOptions options)
//         {
            

//             JsonSerializer.Serialize(writer, widget, widget.GetType(), options);
//         }
//     }
// }